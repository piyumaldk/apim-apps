import React, { useState } from 'react';
import JSZip from 'jszip';
import Handlebars from 'handlebars';

const ZipUploader = () => {
    const [templates, setTemplates] = useState({});
    const [assets, setAssets] = useState({});
    const [renderedOutput, setRenderedOutput] = useState('');

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        const zip = new JSZip();
        const contents = await zip.loadAsync(file);

        const templatePromises = [];
        const cssPromises = [];
        const imagePromises = [];
        const assetMap = {};

        for (const [filename, fileData] of Object.entries(contents.files)) {
            if (!fileData.dir) {
                if (filename.endsWith('.hbs')) {
                    templatePromises.push(
                        fileData.async('text').then((templateContent) => [filename, templateContent]),
                    );
                } else if (filename.endsWith('.css')) {
                    cssPromises.push(
                        fileData.async('text').then((cssContent) => {
                            const blob = new Blob([cssContent], { type: 'text/css' });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('link');
                            link.rel = 'stylesheet';
                            link.href = url;
                            document.head.appendChild(link);
                        }),
                    );
                } else if (/\.(png|jpe?g|gif|svg)$/.test(filename)) {
                    imagePromises.push(
                        fileData.async('blob').then((blob) => {
                            // Remove the "carbon.super" part from the file path.
                            const imageName = filename.replace(/^carbon\.super\//, '');
                            const url = URL.createObjectURL(blob);
                            assetMap[imageName] = url; // Use the processed key format
                        }),
                    );
                }
            }
        }

        const templateEntries = await Promise.all(templatePromises);
        await Promise.all(cssPromises);
        await Promise.all(imagePromises);

        const templateMap = Object.fromEntries(templateEntries);
        setTemplates(templateMap);
        setAssets(assetMap);
    };

    const renderTemplate = (templateName) => {
        if (!templates[templateName]) {
            return;
        }
        const compiledTemplate = Handlebars.compile(templates[templateName]);
        // Pass the assets mapping in the context so templates can use them.
        console.log(assets);
        const output = compiledTemplate({ assets });
        setRenderedOutput(output);
    };

    return (
        <div>
            <input type='file' accept='.zip' onChange={handleFileUpload} />
            <div>
                {Object.keys(templates).map((templateName) => (
                    <button
                        key={templateName}
                        type='button'
                        onClick={() => renderTemplate(templateName)}
                    >
                        {templateName}
                    </button>
                ))}
            </div>
            <div>
                <h3>Rendered Output</h3>
                <div dangerouslySetInnerHTML={{ __html: renderedOutput }} />
            </div>
        </div>
    );
};

export default ZipUploader;

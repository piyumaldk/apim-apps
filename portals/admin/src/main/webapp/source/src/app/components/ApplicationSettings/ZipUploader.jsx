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
                    const imageName = filename.split('/').slice(2).join('/');
                    imagePromises.push(
                        fileData.async('uint8array').then((data) => {
                            const extension = imageName.split('.').pop().toLowerCase();
                            const mimeType = {
                                svg: 'image/svg+xml',
                                png: 'image/png',
                                jpg: 'image/jpeg',
                                jpeg: 'image/jpeg',
                                gif: 'image/gif',
                            }[extension] || 'application/octet-stream';
                            const blob = new Blob([data], { type: mimeType });
                            const url = URL.createObjectURL(blob);
                            assetMap[imageName] = url;
                        }).catch((error) => {
                            console.error('Error processing file:', filename, error);
                            assetMap[imageName] = null;
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
        if (!templates[templateName] || Object.keys(assets).length === 0) {
            return;
        }
        const compiledTemplate = Handlebars.compile(templates[templateName]);
        let output = compiledTemplate({});
        // Image path manipulation in the template with assets
        output = output.replace(/src="\/images\/([^"]+)"/g, (match, filename) => {
            if (assets[filename]) {
                return `src="${assets[filename]}"`;
            }
            return match;
        });
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

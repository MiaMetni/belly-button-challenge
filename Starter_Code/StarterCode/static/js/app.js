// THIS IS MY FINAL VERS. ... CONCISE AND WITHOUT REDENDANCIES
    // if want more comments in code, see app_LongVersion.js
// project goal: build an interactive dashboard to explore the Belly Button Biodiversity dataset, which catalogs the microbes that colonize human navels.

const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

function init() {
    d3.json(url).then(data => {
        const dropdown = d3.select("#selDataset");
        const sample_ids = data.names;

        sample_ids.forEach(id => dropdown.append("option").attr("value", id).text(id));

        const first_entry = sample_ids[0];
        makeBar(first_entry);
        makeBubble(first_entry);
        makeDemographics(first_entry);
    });
};

function makeBar(sample) {
    d3.json(url).then(data => {
        const sample_data = data.samples.find(obj => obj.id === sample);
        const bar_trace = {
            x: sample_data.sample_values.slice(0, 10).reverse(),
            y: sample_data.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
            text: sample_data.otu_labels.slice(0, 10).reverse(),
            type: 'bar',
            orientation: 'h'
        };
        Plotly.newPlot("bar", [bar_trace], { title: "Top Ten OTUs" });
    });
};

function makeBubble(sample) {
    d3.json(url).then(data => {
        const sample_data = data.samples.find(obj => obj.id === sample);
        const bubble_trace = {
            x: sample_data.otu_ids,
            y: sample_data.sample_values,
            text: sample_data.otu_labels,
            mode: 'markers',
            marker: {
                size: sample_data.sample_values,
                color: sample_data.otu_ids,
            }
        };
        Plotly.newPlot("bubble", [bubble_trace], { title: "Bacteria Count for each Sample ID", xaxis: { title: 'OTU ID' }, yaxis: { title: 'Number of Bacteria' } });
    });
};

function makeDemographics(sample) {
    d3.json(url).then(data => {
        const metadata = data.metadata.find(obj => obj.id === +sample);
        const demographics_panel = d3.select('#sample-metadata');
        demographics_panel.html('');
        Object.entries(metadata).forEach(([key, value]) => {
            demographics_panel.append('p').text(`${key}: ${value}`);
        });
    });
};

function optionChanged(value) {
    makeBar(value);
    makeBubble(value);
    makeDemographics(value);
};

init();

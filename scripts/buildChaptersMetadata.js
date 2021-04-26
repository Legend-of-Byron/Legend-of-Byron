const fs = require('fs');
const args = process.argv.slice(2);
const NB_ARGS_PER_CHAPTER = 3;
const chaptersMetadata = [];

const imagelistMap = new Map(fs
    .readFileSync(__dirname + '/../imagelist.csv', { encoding: 'utf8'})
    .split('\n')
    .map(row => row.split(',')));

console.log(Array.from(imagelistMap.entries()));

for(let i = 0; i < args.length; i += NB_ARGS_PER_CHAPTER) {
    const [filename, createdAt, updatedAt] = args.slice(i, i + NB_ARGS_PER_CHAPTER);

    if(!filename || !createdAt || !updatedAt) {
        throw new Error('Unexpected error occurred while building chapters.json')
    }

    const [prefix, chapterNumber, title, status] = filename.split('__');
    const order = Number(chapterNumber);
    chaptersMetadata.push({
        order,
        title: title.replace(/_/g, ' '),
        key: [prefix, chapterNumber, title].join('-'),
        status,
        createdAt: new Date(createdAt).toISOString(),
        updatedAt: new Date(updatedAt).toISOString(),
        url: (imagelistMap.get(chapterNumber) || '').replace(/"/g, '')
    });
}

chaptersMetadata.sort(({order:orderA}, {order:orderB}) => orderA - orderB);

fs.writeFileSync(__dirname + '/../build/chapters.json', JSON.stringify(chaptersMetadata));

require('dotenv').config();
const express = require('express');
const next = require('next');
const path = require('path');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const PORT = process.env.PORT || 1122;
const { BlogDataCard } = require("./Bloglist/DBCardData");
const cors = require('cors');
const fs = require("fs");
const matter = require("gray-matter");
const remark = require("remark");
const html = require("remark-html");






const server = express();


app.prepare().then(() => {
  server.use(express.static(path.join(__dirname, '..', '.next')));
  server.all('*', (req, res) => {
    return handle(req, res);
  });
});


const baseUrl = process.env.BASE_URL_MEDIA;
const IP = process.env.IP_ADD;

for (let index = 0; index < BlogDataCard.length; index++) {
  try {
    BlogDataCard[index].img = BlogDataCard[index].img.replaceAll("{{baseUrl}}",baseUrl);
  } catch (error) {
    console.log(`error in BlogDataCard.js file ${index}th object Error: ${error}`);
    
  }
}



server.use(cors());

const mainPath = path.join(process.cwd(), "content");


server.get("/Bloglist",(req,res)=>{
  res.send(BlogDataCard)
})

// server.get("/", (req, res) => {
//     console.log(BlogDataCard);
    
//     res.send(`<pre>${JSON.stringify(BlogDataCard, null, 2)}</pre>`);
// });

const Count = (BlogDataCard.length+1);

console.log("Count: "+(BlogDataCard.length));


// Static route for blog banner images
server.use("/blogBanner", express.static("Blog_images"));

async function reader() {
  var contentData = [];

  for (let index = 1; index < Count; index++) {
    const fullPath = path.join(mainPath, `blog${index}.md`);
    console.log(fullPath);
    
    try {
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      // console.log(`content ${data.codeStyle1}: ${content}`);
      

      var Recontent = content.replaceAll("{{baseUrl}}",baseUrl)
      const processedContent = await remark().use(html).process(Recontent);

      var contentHtml = processedContent.toString();
      contentHtml = `<div id="H_container"><h1 id="heading">${data.title}</h1>\n<div id="Date">${data.date}</div></div>\n${contentHtml}`;
      

      contentData.push(contentHtml);
    } catch (error) {
      console.log(`something wrong with ${index}th blog content file .md`);
      console.log("Error: "+error);
      
    }
  }

  server.get("/content",(req,res)=>{
    res.send(contentData)
  })
}

let OutData;

reader().then((ContentData)=>{
    OutData = ContentData;
})


// Static routes for individual blog images
for (let index = 1; index < Count; index++) {
  server.use(
    `/blogImages/blog${index}`,
    express.static(`BlogPageImage/Blog${index}`)
  );
}


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

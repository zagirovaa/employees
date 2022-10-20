import express from "express";
import sslRedirect from "heroku-ssl-redirect";
import path from "path";

const app = express();
const port = process.env.PORT || 3000;

app.use(sslRedirect());
app.use(express.json());
app.use(express.static("dist"));
app.use("/", (req, res) => {
    res.sendFile(path.join(`${__dirname}/dist/index.html`));
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});

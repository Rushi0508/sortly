// let ejs = require("ejs");
// let pdf = require("html-pdf");
// const { resolve } = require("path");
// let path = require("path");

import ejs from 'ejs'
import pdf from 'html-pdf'
import path, {resolve} from 'path'

export const createpdf = async function (partyDetails: any, storeDetails: any,entry:any) {
  let html = await ejs.renderFile(
    path.join(__dirname, "./views/" + 'invoice.ejs'),
    {storeDetails,partyDetails,entry}
  );

  let options = {
    size: 'A4',
    // height: "8.5in",
    // width: "11in",
    paginationOffset: 1, // Override the initial pagination number
    footer: {
      contents: {
        // first: "Cover page",
        // 2: "Second page", // Any page number is working. 1-based index
        default:
          '<div style="display: flex;font-size:20px;margin-left: 0.4cm;margin-right: 0.4cm;"><div style="float:left;color: #808080">Developed by Sortly</div><div align="right"><b><span style="color: #444;font-weight: bold">Page {{page}} of {{pages}}</span></b></div></div>', // fallback value
        // last: "Last Page",
      },
    },
  };

  return new Promise((resolve, reject) => {
    pdf.create(html, options).toBuffer(function (err, buffer) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(buffer);
      }
    });
  });
};
const express = require("express")
const Message = require("../models/messages")
const { protect } = require("../middleware/auth")
const router = express.Router()
const {PDFDocument,rgb,StandardFonts} = require("pdf-lib")
const fs = require("fs")
const path = require("path")

router.post("/generate",protect,async (req,res) => {
     const {studentname,coursetitle} = req.body;
    // console.log(studentname,coursetitle);
    try {
       const pdfdoc = await PDFDocument.create();
       const page = pdfdoc.addPage([600,400])
       const font = await pdfdoc.embedFont(StandardFonts.HelveticaBold)
       const fontSize = 24;
     
       const bgbytes = fs.readFileSync(path.join(__dirname,"../assets/certificate-background-4692-x-3318-d0ojnsi3vzzhqdqu.jpg"))
       const bgimage = await pdfdoc.embedJpg(bgbytes)
       const bgdims = bgimage.scale(1)

       page.drawImage(bgimage,{
        x:0,
        y:0,
        width:600,
        height:400
       })

       page.drawText("Certificate of completion",{
        x:200,
        y:250,
        size: 26,
        font,
        color: rgb(0,0,0)
       })

       page.drawText(`${studentname}`,{
        x:200,
        y:220,
        size:fontSize,
        color: rgb(0,0,0)
       })

       

        page.drawText(`has successfully completed`,{
        x:200,
        y:190,
        size:fontSize - 4,
        color: rgb(0,0,0)
       })

       page.drawText(`${coursetitle} course`, {
        x:200,
        y:160,
        size: fontSize,
        color: rgb(0,0,0)
       })

       const pdfBytes = await pdfdoc.save();
       res.set({
        "Content-Type":"application/pdf",
        "Content-Disposition":"attachment; filename=certificate.pdf",
        "Content-Length": pdfBytes.length
       })
     return  res.send(Buffer.from(pdfBytes))
       
    } catch (error) {
         console.log(error);
        if(!res.headersSent){
              res.status(500).json({error: "Failed to generate certificate"})
        }
       
  
    }
})

module.exports = router;
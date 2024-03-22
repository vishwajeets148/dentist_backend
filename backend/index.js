
// /// Serving the frontend

// app.use(express.static(path.join(__dirname, "./frontend/build")));

// app.get("*", function (_, res) {
//     res.sendFile(
//       path.join(__dirname, "./frontend/build/index.html"),
//       function (err) {
//         res.status(500).send(err);
//       }
//     );
//   });


// app.listen(port,()=>{
//     console.log("This server running on port:"+port)
//     console.log(`http://localhost:${port}`)
// })
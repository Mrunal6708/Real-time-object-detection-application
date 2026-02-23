import './App.css'
import Webcam from "react-webcam";
import {useEffect, useRef, useState} from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";


let interval;  

const App=()=> {
  const webcamRef = useRef(null);
  const capture = useRef(null);
  const [loading ,setLoading] = useState(true);
  const [detectionMap, setDetectionMap] = useState({});

     useEffect(()=>{
       starPrediction();

       return ()=>{
         if(interval){
         clearInterval(interval);
       };
      }
     },[]);
    
     //console.log("webcam:", webcamRef.current?.video?.readyState);
   const starPrediction = async ()=>{
     const model = await cocoSsd.load();
     setLoading(false);
    
    interval=setInterval(()=>{
          detect(model);
        },100);
      };
    const detect = async (model)=>{
      if(webcamRef && webcamRef.current && webcamRef.current.video){
         const video = webcamRef.current.video;
         const videowidth = video.videoWidth;
         const videoheight = video.videoHeight;

         canvasRef.current.width = videowidth;
         canvasRef.current.height = videoheight;

          const prediction = await model.detect(video);

          const ctx = canvasRef.current.getContext("2d");

          //draw the mesh
          drawMesh(prediction, ctx);

      }
   };

   const drawMesh =(prediction, ctx)=>{
    prediction.forEach((prediction) =>{
      const [x,y,width,height] = prediction.bbox;
      const text = prediction.class;
      handalDetectionMap(text);
      ctx.strokeStyle = "green";
      ctx.font="18px Arial";
      ctx.fillStyle = "green";
      ctx.fillText(text, x, y);
      ctx.rect(x, y, width, height);
      ctx.stroke();
      // console.log(prediction);
    });
  };

  const handalDetectionMap =  (detection)=>{
    let obj = {...(detectionMap || {})};
    if (detectionMap?. [detection]){
      obj[detection] ++;
      //increse the count
    }else{
      obj[detection] = 1;
    }
    setDetectionMap(obj);

    if(obj?.['person'] > 1){
      alert('Another person detected ');
    };
     
    if(detection==='cell phone'){
      alert('Another cell phone detected ');
    }
  };


  return (<div className="parentContainer">
    <h1 className='appTitle'>Real time object detection</h1>
    {loading? <span>Loading model...</span> : "Model loaded"}
    <div className='videoWrapper'>
    <Webcam ref={webcamRef}/>
    <canvas ref={capture}/>
    </div>
  </div>
  );
};

export default App

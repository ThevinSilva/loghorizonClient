import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import Cropper from 'react-easy-crop';
import * as AiIcons from 'react-icons/ai'
import { Button, Range } from 'react-materialize';
import getCroppedImg from './cropImage';



const  Uploader = ({image,setImage}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        image,
        croppedAreaPixels,
        rotation
      )
      console.log('donee', { croppedImage })
      setImage(croppedImage)
    } catch (e) {
      console.error(e)
    }
  }, [croppedAreaPixels, rotation])

  const onClose = useCallback(() => {
    setImage(null)
  }, [])

  return (
    <div style={{height:'40vh'}}>
      <div >
        <Cropper
          image={image}
          crop={crop}
          rotation={rotation}
          zoom={zoom}
          aspect={4 / 4}
          onCropChange={setCrop}
          onRotationChange={setRotation}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      {/* controlls */}
      <div className='row'>
         <Button
         className=' amber darken-3'
          node="button"
          style={{
            marginTop: '25%'
          }}
          flat
          waves="light"
          onClick={showCroppedImage}
          modal='close'
        >
          <AiIcons.AiFillSave style={{fontSize:'2rem'}}/>
        </Button>
      </div>
      <div className='row'>
        <Button
         className=' amber darken-3'
          node="button"
          style={{
            marginTop: '5%'
          }}
          flat
          waves="light"
          onClick={(e) => {e.preventDefault(); setImage(null)  } }
          modal='close'
        >
          <AiIcons.AiFillDelete style={{fontSize:'2rem'}}/>
        </Button>
      </div>
    </div>
  )
}


export default Uploader;
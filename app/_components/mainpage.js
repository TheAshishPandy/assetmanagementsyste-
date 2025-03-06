import backgroundImg from '/public/mainimage.jpg';
import { Container, TextField, Button, Typography, CssBaseline, Box } from '@mui/material';
import Image from 'next/image'; 

export default function mainpage(){
    return (
        <div>
      <Box
        sx={{
          position: 'fixed',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <Image
          src={backgroundImg}
          alt="Background"
          layout="fill"
          objectFit="cover"
        />
      </Box>

        </div>
    )
}
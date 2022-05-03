import { Button, Card, CardHeader, CircularProgress, Dialog, Grid, IconButton, ImageList, ImageListItem, ImageListItemBar, TextField, Typography } from '@mui/material'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import React, { useEffect, useState } from 'react'
import CheckIcon from '@mui/icons-material/Check';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux'
import ViasTable from '../ViasTable'
import { useTheme } from '@emotion/react';
import { addNewSector, getSectoresImage } from '../../services/api.services';
import { setSector } from '../../redux/Actions/api.action';

export default function EditSector(props) {
    const theme = useTheme()
    const sector = useSelector(state => state.sector.sector)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const [name, setName] = useState(sector.name || "")
    const [lat, setLat] = useState(sector.lat || "")
    const [long, setLong] = useState(sector.long || "")
    const [map, setMap] = useState(sector.map || "")
    const [sectorImages, setSectorImages] = useState(sector.images || [])
    const [images, setImages] = useState([])
    useEffect(() => {
        getSectoresImage().then((imgs) => {
            setImages(imgs)
        }).then(() => setLoading(false))
    }, [])
    const handleImage = (url) => {
        const index = sectorImages.indexOf(url)
        if (index == -1) {
            setSectorImages((prevState) => [...prevState, url])
        } else {
            setSectorImages((prevState) => prevState.filter((v, i) => i !== index))
        }
    }
    const addSector = async () => {
        const asking = withReactContent(Swal)
        asking.fire({
            icon: "question",
            title: "Nuevo Sector",
            text: "¿Está seguro de que quiere guardar los datos?",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            cancelButtonColor: "red",
            confirmButtonText: 'Guardar',
            confirmButtonColor: theme.palette.secondary.contrastText
        }).then(async (ans) => {

            if (ans.isConfirmed) {
                const newSector = {
                    name,
                    lat,
                    long,
                    map,
                    images: sectorImages,
                    vias: []
                }
                try {
                    const chk = await addNewSector(newSector);
                    asking.fire({
                        icon: "success",
                        title: "Nuevo Sector",
                        text: "El nuevo sector fue agregado con éxito.",
                        confirmButtonColor: theme.palette.secondary.contrastText
                    })
                } catch (error) {
                    throw new Error(error)
                }
            }
        }
        ).catch(() => asking.fire({
            icon: "error",
            title: "Error",
            text: "Lo sentimos hubo un error inesperado"
        }))
    }

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <IconButton color="error" onClick={() => dispatch(setSector({}))} sx={{ alignSelf: "flex-end" }}>
                <CloseIcon /></IconButton>
            <Grid container spacing={3} sx={{ p: 2 }}>
                <Grid item sx={{ width: '100%' }}>
                    <TextField id="upSectorName" variant='standard' defaultValue={name} label="Nombre" onChange={(e) => setName(e.target.value)} />
                </Grid>
                <Grid item sx={{ width: '100%' }}>
                    <TextField id="upSectorLat" variant='standard' defaultValue={lat} label="Latitud" onChange={(e) => setLat(e.target.value)} />
                    <TextField id="upSectorLong" variant='standard' defaultValue={long} label="Longitud" onChange={(e) => setLong(e.target.value)} />
                </Grid>
                <Grid item sx={{ width: '100%', placeItems: 'center' }}>
                    <Typography variant='subtitle1' sx={{ color: theme.palette.grey['700'] }}>Seleccione la Guía</Typography>
                    {!loading ? map == "" ? <ImageList sx={{ width: '100%', maxHeight: '60vh' }} cols={3} rowHeight={164}>
                        {images.map((item) => (
                            <ImageListItem key={item._id}>
                                <img
                                    src={`${item.url}?w=164&h=164&fit=crop&auto=format`}
                                    srcSet={`${item.url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                    alt={item.name}
                                    loading="lazy"
                                    onDoubleClick={() => { setMap(item.url) }}
                                />
                            </ImageListItem>
                        ))}
                    </ImageList> : <Typography variant='caption' sx={{ color: theme.palette.primary.light }}>Guia Seleccionada{'\u00A0'}{'\u00A0'}{'\u00A0'}<RemoveIcon sx={{ color: theme.palette.primary.light }} onClick={() => setMap("")} /></Typography> : <CircularProgress color="success" sx={{ justifySelf: 'center' }} />}
                </Grid>
                <Grid item sx={{ width: '100%', placeItems: 'center' }}>
                    <Typography variant='subtitle1' sx={{ color: theme.palette.grey['700'] }}>Seleccione Algunas Fotos</Typography>
                    {!loading ? <ImageList sx={{ width: '100%', maxHeight: '60vh' }} cols={3} rowHeight={256}>
                        {images.map((item) => (
                            <ImageListItem key={item._id}>
                                <img
                                    style={{ container: { height: 164 } }}
                                    src={`${item.url}?w=164&h=164&fit=crop&auto=format`}
                                    srcSet={`${item.url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                    alt={item.name}
                                    loading="lazy"
                                    onDoubleClick={() => handleImage(item.url)}
                                />
                                <ImageListItemBar

                                    actionIcon={sectorImages.indexOf(item.url) != -1 ? <CheckIcon sx={{ color: theme.palette.primary.light }} /> : <RemoveIcon sx={{ color: theme.palette.primary.light }} />}
                                />
                            </ImageListItem>
                        ))}
                    </ImageList> : <></>}
                </Grid>
                <Grid item sx={{ width: "100%" }}>
                    {sector._id == 0 ? <></> : <ViasTable editable="true" />}
                </Grid>
                <Grid item sx={{ width: "100%" }}>
                    {sector._id == 0 ? <Button variant='contained' sx={{ width: "100%", color: theme.palette.primary.contrastText }} onClick={() => { addSector() }}>Nuevo Sector</Button> : <Button variant='contained' sx={{ width: "100%", backgroundColor: theme.palette.secondary.contrastText }}>Modificar Sector</Button>}
                </Grid>
            </Grid>
        </div>
    )
}

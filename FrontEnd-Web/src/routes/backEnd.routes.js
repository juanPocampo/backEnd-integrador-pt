const BASEURL = "http://127.0.0.1:3000/api";
const sectoresUrl = `${BASEURL}/sectores`;
const viasUrl = `${BASEURL}/vias`;
const imagesUrl = `${BASEURL}/images`;

const routes = {
  allSectores: () => sectoresUrl,
  sector: (id) => `${sectoresUrl}/${id}`,
  allVias: () => `${viasUrl}`,
  via: (id) => `${viasUrl}/${id}`,
  allImages: () => imagesUrl,
  sectoresImages: () => `${imagesUrl}/sectores`,
  viasImages: () => `${imagesUrl}/vias`,
};
export default routes;

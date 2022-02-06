// ================ CONSTANTES ================
const APIKEY = "7886a12c53604b2668a08582a04795afcc9375b0";
const GEOAPIFY_KEY = "a6398dc4deac4d708c5232446cdd8bf1";
var pointList = new Array();
// ================ FONCTIONS AFFICHAGE LAYER DE LA CARTE ==================
var map;
class MapContainer extends React.Component {
    async componentDidMount() {
        // create map
        map = L.map('map' /* the id of the tag used for map injection */);
        map.setView([46.1 /*latitude*/, 1.1 /*longitude*/], 5 /*zoom*/);

        // --- We add a layer based on OpenStreetMap ---
        L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);   // Base Map

        var citiesList = await citiesRequest();
        citiesList.forEach(city => {
            placerVille(city);
        });
      }
 
    render() {
      return <div id="mapTile"></div>
    }
  }

  ReactDOM.render(
    <MapContainer/>,
    document.getElementById('map')
  ); 

// ================ FONCTIONS OPENSTREETMAP ==================

async function getCoordinate(address){
    
    var url = "https://api.geoapify.com/v1/geocode/search?text="+address.replaceAll(' ', '%20')+"&limit=1&format=json&apiKey="+ GEOAPIFY_KEY;
    var response = await fetch(url);
    var latLon = [];
    if (response.status == 200) {
        let json = await response.json();
        latLon.push(json.results[0].lat, json.results[0].lon);
        return latLon;
      }
    throw new Error(response.status);
}

async function placerVille(ville) {
    // --- We add a new layer to the map that contains some markers ---
    var point = L.marker(await getCoordinate(ville));
    point.title = ville

    point.addEventListener('click', function() { 
        placerStations(this.title);
        map.setView([point._latlng.lat, point._latlng.lng], 15);      
    })

    point.addTo(map);
    pointList.push(point);
}

// ================ FONCTION DE RENDU REACT ================
ReactDOM.render(
  <Nav name="Bike Mapper"/>,
  document.getElementById('root')
);

function Nav(props){
  return(
    <nav>
      <h1 className="apiTitle">{props.name}</h1>
      <Header/>
    </nav>
  );
}

function Header(props){
  const [cities, setCities] = React.useState([])
  React.useEffect(()=>{
     citiesRequest().then(data=>{
       setCities(data)
     });
   },[])

   const [selectedCity, setSelectedCity] = React.useState("none");
   function handleSelectChange(event) {
        setSelectedCity(event.target.value);
    }
    React.useEffect(() => {
        pointList.forEach(point => {
            if(selectedCity == "none"){
                map.setView([46.1, 1.1], 5);
            }
            else if(point.title == selectedCity){
                placerStations(point.title);
                map.setView([point._latlng.lat, point._latlng.lng], 15);
            }
        });
      }, [selectedCity]);
      
    return(
        <header>
        <Menu/>
        <LeftMenu/>
        <form id="cityChoice">
            <label for="citySelected">Ville : </label>
            <select name="citiesList" id="citySelected" value={selectedCity} onChange={handleSelectChange}>
            <option key="none" value="none">-- Choisissez une ville --</option>
            {cities.map((city) => <option key={city} value={city}>{city} 
            </option>)}
            </select>
        </form>   
        </header>
    );
}   

function Menu(props){
  return(
    <div id="menu">
    <button class="material-icons" onClick={leftMenu}>
        menu
    </button>
  </div>
  );
}

function LeftMenu(props){
  return(
    <div id="leftMenu">
            <button class="material-icons" onClick={leftMenu}>close</button>
            <div class="div-menu"><a href="./home.html">Accueil</a></div>
        </div>
  );
}

// ================ FONCTIONS API JCDecaux ==================

async function citiesRequest(){
  return new Promise((resolve,reject)=>{
    var citiesArray = [];
    fetch("https://api.jcdecaux.com/vls/v3/contracts?apiKey="+APIKEY)
      .then((response) => response.json())
      .then(function(data){
      data.forEach(element => {
        if(element.country_code == 'FR'){
          citiesArray.push(element.name.toUpperCase());
        }
        }); 
      resolve(citiesArray);
    })
  })
}

function placerStations(ville) {
    var url = "https://api.jcdecaux.com/vls/v1/stations?contract=" + ville + "&apiKey="+APIKEY;
    var obj;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url,false);

    xhr.onload = function () {
        obj = JSON.parse(this.responseText);
    };
    xhr.send();

    obj.forEach(element => {
        var point = L.marker([element.position.lat,element.position.lng]);
        var state = element.status == "OPEN" ? "ouverte" : "fermée";
        point.bindPopup("Station " + state + ": "+ element.name +"<br>"+
                        "Adresse: "+ element.address +"<br>"+
                        "Vélos disponibles: " + element.available_bikes +"<br>"+
                        "Places disponibles: " + element.available_bike_stands);
        point.addTo(map);
    });
}

// -------------- FONCTION DES SIDES MENU --------------
var leftDeployed = false;
function leftMenu(){
  if(leftDeployed){
    document.getElementById('leftMenu').style.left = '-100%';
    leftDeployed = !leftDeployed;
  }
  else{
    document.getElementById('leftMenu').style.left = 0;
    leftDeployed = !leftDeployed;
  }
}

var rightDeployed = false;
function rightMenu(){
  if(rightDeployed){
    document.getElementById('rightMenu').style.right = '-100%';
    rightDeployed = !rightDeployed;
  }
  else{
    document.getElementById('rightMenu').style.right = 0;
    rightDeployed = !rightDeployed;
  }
}
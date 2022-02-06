function Header(props) {
    return (<header><h1>Bike Mapper</h1></header>);
}
function Bandeau(props) {
    return (<div id="bandeau"></div>);
}
function Presentation(props) {
    return (
        <div id="presentation">
            <p> Notre application fonctionne en version web et mobile. Elle est responsive est compatible avec Chrome, FireFox et Brave.
            Nous avons fait le choix de n'utiliser que les villes de france métropolitaine pour plus de lisibilité. Les technologies utilisées sont le HTML/CSS, javascript et React JS.</p>
        </div>
    );
}
function Navigation(props) {
    return (<div id="access"><a href='../html/cities.html'><button class="material-icons">login</button></a></div>);

}

function Groupe(props) {
    return (
        <footer id="foot">
        <h3>Membres:</h3>
        <p>Samuel Kernen</p>
        <p>Ndéye Awa Ndiaye</p>
        <p>Florian Gomas</p>
        </footer>
        );
}

const Titre = <div>
    <Header name='title'></Header>
    <Bandeau id="bande"></Bandeau >
    <Presentation id="presentation"></Presentation >
    <Navigation  name='access'></Navigation>
    <Groupe name='groupe'></Groupe>
    </div>;


ReactDOM.render(
    Titre,
    document.getElementById('Home')
);




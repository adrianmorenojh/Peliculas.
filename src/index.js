
console.log("gola");
(async function peliculas(){


    async function getData(url) {

        //pidiendo los datos de las peliculas
        const response = await fetch(url);
        const data = await response.json();
        if (data.data.movie_count > 0) {
          // aquí se acaba
          return data;
        }
        // si no hay pelis aquí continua
        throw new Error('No se encontró ningun resultado');
      }

      const $form = document.getElementById('form');
      const $home = document.getElementById('container');
      const $derecha = document.getElementById('derecha')
      const $featuringContainer = document.getElementById('buscador');

      function setAttributes($element, attributes) {
        for (const attribute in attributes) {
          $element.setAttribute(attribute, attributes[attribute]);
        }
      }


      const BASE_API = 'https://yts.mx/api/v2/list_movies.json';
      var pelicula =`https://yts.lt/api/v2/list_movies.json?genre=action`;

      //contenido del buscador
      function featuringTemplate(peli) {
        return (
          `
          <div class="buscador">
            <div class="buscador-image">
              <img src="${peli.medium_cover_image}" width="70" height="100" alt="">
            </div>
            <div class="featuring-content">
              <p class="buscador-title">Pelicula encontrada</p>
              <p class="buscador-album">${peli.title}</p>
            </div>
          </div>
          `
        )
      }

      //cargando  peliculas
      $form.addEventListener('submit', async (event) => {
        event.preventDefault();
        $derecha.classList.add('active')
        const $loader = document.createElement('img');
        setAttributes($loader, {
          src: 'loader.gif',
          height: 50,
          width: 50,
        })
        $featuringContainer.append($loader);


        //barra buscadora de peliculas
        const data = new FormData($form);
        try {
          const {
            data: {
              movies: pelis
            }
          } = await getData(`${BASE_API}list_movies.json?limit=1&query_term=${data.get('name')}`)
    
          const HTMLString = featuringTemplate(pelis[0]);
          $featuringContainer.innerHTML = HTMLString;
          debugger
        } catch(error) {
          alert(error.message);
          $loader.remove();
          $featuringContainer.classList.remove('heigth');
        }
      })

      //peliculas
      function videoItemTemplate(movie, category) {
    return (
      `<div class="pelicula" data-id="${movie.id}" data-category=${category}>
        
          <img src="${movie.medium_cover_image}">
        
        <h4 class="titulo">
          ${movie.title}
        </h4>
      </div>`
    )
  }











  function createTemplate(HTMLString) {
    const html = document.implementation.createHTMLDocument();
    html.body.innerHTML = HTMLString;
    return html.body.children[0];
  }


  function addEventClick($element) {
    $element.addEventListener('click', () => {
      // alert('click')
      showModal($element)
    })
  }



  //recomendada

  function peliculasRecomendadas(movie, category){
    return(
      `<li class="pelicularecomendada" data-id="${movie.id}" data-category=${category} > 
      <img class="imagenpelicularecomendada"src="${movie.medium_cover_image}" alt="">
      <p>${movie.title}</p>
      </li>`
    )
  }

  function ultimosEstrenos(movie, category){
    return(
      `<li class="ultimas" data-id="${movie.id}" data-category=${category}>
        ${movie.title}
        </li>`
    )
  }

  function enviandoRecomendada(list, $contenedor, category){
    $contenedor.children[0].remove();
    list.forEach((pelicula) => {
      const parrafo = peliculasRecomendadas(pelicula, category);
      const elemento = createTemplate(parrafo);
      $contenedor.append(elemento);
      const imagen = elemento.querySelector('img');


      addEventClick(elemento);
    })


    
  }

  function enviandoUltimas(list, $contenedor, category){

    $contenedor.children[0].remove();
    list.forEach((pelicula) =>{
      const parrafo = ultimosEstrenos(pelicula, category);
      const elemento = createTemplate(parrafo);
      $contenedor.append(elemento);
      // const li = elemento.querySelector('li');
      
      // li.addEventListener('load', (event) => {
      //   event.srcElement.classList.add('fadeIn');
      // })

      addEventClick(elemento);
    })
  }
  // const generos = await getData(`${BASE_API}list_movies.json?genre`) 
  const { data: { movies: actionList} } = await getData(`${BASE_API}list_movies.json?genre=action`);
  window.localStorage.setItem('actionList', JSON.stringify(actionList));

  const PRecomendada = actionList;
  const $content = document.getElementById('recomendadas');
  debugger
  enviandoRecomendada(PRecomendada, $content, 'action');

  const UltimosE = actionList;
  const $contenedor = document.getElementById('ultimos');
  enviandoUltimas(UltimosE, $contenedor, 'action');


  function renderMovieList(list, $container, category) {
    // actionList.data.movies
    $container.children[0].remove();
    list.forEach((movie) => {
      const HTMLString = videoItemTemplate(movie, category);
      const movieElement = createTemplate(HTMLString);
      $container.append(movieElement);
      debugger
      const image = movieElement.querySelector('img');
      image.addEventListener('load', (event) => {
        event.srcElement.classList.add('fadeIn');
      })
      addEventClick(movieElement);
    })
  }
  
  // function peliculasree(list, content, lo){
  //   debugger
  //   list.forEach((movie) => {
      
  //     const peliculaRecomendada = peliculasRecomendadas(movie, category);
  //     const peliculaR = createTemplate(peliculaRecomendada);
  //     $Container.append(peliculaR);
  //     const image = peliculaR.querySelector('img');


  //     addEventClick(peliculaR);
  //   })

  // }
  
  
  async function cacheExist(category) {
    const listName = `${category}List`;
    const cacheList = window.localStorage.getItem(listName);
    
    if (cacheList) {
      return JSON.parse(cacheList);
    }
    const { data: { movies: data } } = await getData(`${BASE_API}list_movies.json?genre=${category}`)
    window.localStorage.setItem(listName, JSON.stringify(data))
    
    return data;
  }
  
  
  
  

  // const { data: { movies: actionList} } = await getData(`${BASE_API}list_movies.json?genre=action`)
  // const actionList = actionlist;
  // window.localStorage.setItem('actionList', JSON.stringify(actionList))
  const $actionContainer = document.querySelector('#action');
  renderMovieList(PRecomendada, $actionContainer, 'action');

  
  // const  re = await cacheExist('action');

  // const $content = document.getElementById('recomendada');
  // renderMovieList(re, $content , 'action');
 

  const dramaList = await  cacheExist('drama');
  const $dramaContainer = document.getElementById('drama');
  renderMovieList(dramaList, $dramaContainer, 'drama');

  const animationList = await  cacheExist('animation');
  const $animationContainer = document.getElementById('animation');
  renderMovieList(animationList, $animationContainer, 'animation');

 // const $home = $('.home .list #item');
 const $modal = document.getElementById('modal');
 const $overlay = document.getElementById('overlay');
 const $hideModal = document.getElementById('hide-modal');

 const $modalTitle = $modal.querySelector('h1');
 const $modalImage = $modal.querySelector('img');
 const $modalDescription = $modal.querySelector('p');

 function findById(list, id) {
   return list.find(movie => movie.id === parseInt(id, 10))
 }

 function findMovie(id, category) {
   switch (category) {
     case 'action' : {
       return findById(PRecomendada, id)
     }
     case 'drama' : {
       return findById(dramaList, id)
     }
     default: {
       return findById(animationList, id)
     }
   }
 }


 function showModal($element) {
  $overlay.classList.add('active');
  $modal.style.animation = 'modalIn .8s forwards';
  const id = $element.dataset.id;
  const category = $element.dataset.category;
  const data = findMovie(id, category);
  debugger

  $modalTitle.textContent = data.title;
  $modalImage.setAttribute('src', data.medium_cover_image);
  $modalDescription.textContent = data.description_full
}

$hideModal.addEventListener('click', hideModal);
function hideModal() {
  $overlay.classList.remove('active');
  $modal.style.animation = 'modalOut .8s forwards';

}





})()


function InitVisionneuse(Source){

  var h = $('#modal-numerisations').find('.modal-body').height();
  $('#visio').css('height',h+'px').addClass('chargement');

  Visionneuse = OpenSeadragon({
      id: "visio",
      prefixUrl: "https://cdn.jsdelivr.net/npm/openseadragon@4.1/build/openseadragon/images/",
      tileSources: Source,
      initialPage: 0,
      sequenceMode: false,
      toolbar: false,
      //previousButton: "precedent",
      //nextButton: "suivant",
      fullPageButton: "plein-ecran",
      zoomInButton:   "zoom-plus",
      zoomOutButton:  "zoom-moins",
    //showNavigationControl: false,
    //showZoomControl: true,
    //showFullPageControl: false,
      //showHomeControl: false,
      autoHideControls: false,
      immediateRender: true,
      preload: true,
      imageSmoothingEnabled: true,
      //maxZoomPixelRatio: 0.5,
      minZoomImageRatio: 0.2,
      //maxZoomLevel: 1,
      defaultZoomLevel: 0,
      viewportMargins: {top: 15, bottom: 15, left: 15, right: 15},
      gestureSettingsMouse: {
        clickToZoom: 1,
      },
      showSequenceControl: false,
      springStiffness: 4,
      animationTime: 0,
      /*overlays: [{
        id: 'test',
        px: 0.1,
        py: 0.1,
        width: 1,
        placement: 'RIGHT',
        checkResize: false
      }],*/
  });

// Assuming 'viewer' is your OpenSeadragon viewer instance
Visionneuse.addHandler('open', function() {

    var tiledImage = Visionneuse.world.getItemAt(0);
    var imageSize = tiledImage.getContentSize();
    var aspectRatio = imageSize.y / imageSize.x;
    var overlayElement = document.createElement('div');
    overlayElement.className = 'bordure';

    var rect = new OpenSeadragon.Rect(0, 0, 1, aspectRatio);

    Visionneuse.addOverlay({
        element: overlayElement,
        location: rect,
        checkResize: false  
    });
  
});


  var isFullyLoaded = false;

  /* Action au changement de page */
  Visionneuse.addHandler("page", ChangementPage, {});
  Visionneuse.addHandler("full-screen", ChangementPleinEcran, {pageCourante: Visionneuse.currentPage()});
  Visionneuse.addHandler('animation-finish', finAnimation, {} );
  Visionneuse.addHandler('animation-start', debutAnimation, {} );

  /* Action à l'apparition d'une image dans la visionneuse */
  Visionneuse.world.addHandler('add-item', function(event) {
    var tiledImage = event.item;
    tiledImage.addHandler('fully-loaded-change', function() {
      var newFullyLoaded = areAllFullyLoaded();
      if (newFullyLoaded !== isFullyLoaded) {
        isFullyLoaded = newFullyLoaded;
      }
      ImageChargee()
    });
  });

  /* Une fois l'image chargee */
  function ImageChargee(){
    $('#visio').removeClass('visio-chargement');
    $('#visio').addClass('chargee');
    $('.anim-chargement').remove();
  }

  /* Au changement de page */
  function ChangementPage(event, obj){
    var courant = event.page;
    if(courant > 0){
      $('#visio').removeClass('chargee');
      $(AnimChargement).appendTo($('body'));
    }
  }

  /* Au changement de mode plein écran */
  function ChangementPleinEcran(eventSource, fullScreen, userData){
    var courant = Visionneuse.currentPage();
    if(eventSource.fullScreen){
      $('.openseadragon-container').hide().css('background',Fond)
    }else{
      $('.openseadragon-container').hide().css('background',Fond)
    }
    window.setTimeout(function(){
      $('.openseadragon-container').show()
    },500)
    //MenuVisio.insertAfter($('#visio'));
  }

  /* Au début de l'animation */
  function debutAnimation(event, obj){}

  /* A la fin de l'animation */
  function finAnimation(event, obj){
  }

  // boucle de vérification du chargement complet des images de la visionneuse
  function areAllFullyLoaded() {
    var tiledImage;
    var count = Visionneuse.world.getItemCount();
    for (var i = 0; i < count; i++) {
      tiledImage = Visionneuse.world.getItemAt(i);
      if (!tiledImage.getFullyLoaded()) {
        return false;
      }
    }
    return true;
  }

}

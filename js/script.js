$('#place-form').on('input', function() {
	$('#place').html( $(this).val() );
});

$('#download-zip').click( function() {
  prepareFiles();
});

var loaded = 0;
var svg, png1, png2, png3;

function prepareFiles(){
  svg = $('#svg-wrap').html();
  getSvgAsPng(560*4, 165*4, 'transparent', function(str){ png1 = str; loaded++; });
  getSvgAsPng(560, 165, 'transparent',function(str){ png2 = str; loaded++;});
  getSvgAsPng(560*4, 165*4, '#fff', function(str){ png3 = str; loaded++;});
  packZip();
}

function packZip()  
{
  if ( loaded < 3 ) {
    window.setTimeout(packZip,50);
    return;
  }
  var zip = new JSZip();
  var folder = zip.folder("serlo_community_logo");

  folder.file("serlo_community_logo.svg", svg);
  folder.file("serlo_community_logo_big.png", png1, {base64: true} );
  folder.file("serlo_community_logo_small.png", png2, {base64: true} );
  folder.file("serlo_community_logo_whitebg.png", png3, {base64: true} );

  zip.generateAsync({type:"blob"})
  .then(function(content) {
      saveAs(content, "serlo_community_logo.zip");
    });
}

function getSvgAsPng(cwidth, cheight, bgcolor, callback){
  var svgElement = $('#preview');

  svgElement.data('width',svgElement.attr('width'));
  svgElement.data('height',svgElement.attr('height'));
  svgElement.attr('width',cwidth);
  svgElement.attr('height',cheight);
  var svgURL = new XMLSerializer().serializeToString(svgElement.get(0));
  svgElement.attr('width',svgElement.data('width'));
  svgElement.attr('height',svgElement.data('height'));

  var canvas = document.createElement('canvas');
  canvas.width = cwidth;
  canvas.height = cheight;
  canvas.style.display = 'none';
  document.body.appendChild(canvas);
  var ctx = canvas.getContext("2d");

  var img  = new Image();
  img.onload = function(){
    ctx.drawImage(this, 0,0);
    var returnString = canvas.toDataURL('image/png').substring(22);
    callback(returnString);
   	document.body.removeChild(canvas);
    }
  if(bgcolor !== 'transparent') {
    ctx.rect(0, 0, cwidth, cheight);
    ctx.fillStyle = bgcolor;
    ctx.fill();
  }
  img.src = 'data:image/svg+xml; charset=utf8, '+encodeURIComponent(svgURL);
}
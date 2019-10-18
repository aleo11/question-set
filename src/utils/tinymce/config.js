export const inits = {
    forced_root_block:'',
    mode : "textareas",
    menubar: false,
    plugins: ['code',
    'advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker',
    'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
    'save table contextmenu directionality emoticons template paste imagetools textcolor fullscreen'
    ],
    image_advtab: true,
    table_default_styles: {
        width: '100%',
         borderCollapse: 'collapse'
    },
    block_formats: 'Paragraph=p',
    branding:false,
    toolbar:  'formatselect | bold italic strikethrough forecolor backcolor permanentpen formatpainter | image pageembed | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent | removeformat | addcomment |fullscreen',
    language_url: `./tinymce/langs/zh_CN.js`,
    language: "zh_CN",
    paste_data_images : true,
    images_dataimg_filter:function(img){
        return img.hasAttribute('internal-blob');
    },
    file_picker_callback: function (cb, value, meta) {
        var input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
    
        /*
          Note: In modern browsers input[type="file"] is functional without
          even adding it to the DOM, but that might not be the case in some older
          or quirky browsers like IE, so you might want to add it to the DOM
          just in case, and visually hide it. And do not forget do remove it
          once you do not need it anymore.
        */
        input.onchange = function (files) {
          var file = this.files[0];
          var reader = new FileReader();
          reader.onload = function () {
            /*
              Note: Now we need to register the blob in TinyMCEs image blob
              registry. In the next release this part hopefully won't be
              necessary, as we are looking to handle it internally.
            */
            // var blobCache =  tinymce.activeEditor.editorUpload.blobCache;
            var base64 = reader.result;
            // var blobInfo = blobCache.create(id, file, base64);
            // blobCache.add(blobInfo);
    
            /* call the callback and populate the Title field with the file name */
            cb(base64, { title: "ok" });
          };
          reader.readAsDataURL(file);
        };
        input.click();
      },
    file_picker_type:"image",
    imagetools_toolbar: "rotateleft rotateright | flipv fliph | editimage imageoptions"
}
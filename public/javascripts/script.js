const $fileInput = $('#img-upload');

$fileInput.on('change', () => {
    console.log($fileInput[0].value.substring(12));
    if ($fileInput[0].value) {
        $('#file-name').html($fileInput[0].value.substring(12));
    }
});

function isImg(mimetype) {
    const validImgTypes = ['image/jpeg', 'image/png'];
    return validImgTypes.includes(mimetype);
  }
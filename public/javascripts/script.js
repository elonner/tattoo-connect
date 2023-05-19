const $fileInput = $('#img-upload');
const $navBurger = $('.navbar-burger');
const $delete = $('button.del-btn');

$fileInput.on('change', e => {
    console.log($fileInput[0].value.substring(12));
    if ($fileInput[0].value) {
        $('#file-name').html($fileInput[0].value.substring(12));
    }
});

$navBurger.on('click', e => {
    $(`#${$navBurger[0].dataset.target}`)[0].classList.toggle('is-active');
    $navBurger[0].classList.toggle('is-active');
});

$delete.on('click', e => {
    if (!confirm('Are you sure you want to delete this post?')) {
        e.preventDefault();
    }
});

function isImg(mimetype) {
    const validImgTypes = ['image/jpeg', 'image/png'];
    return validImgTypes.includes(mimetype);
}

export const hideAlert = () => {
    const el = document.querySelector('.alert');
    if (el && el.parentElement) el.parentElement.removeChild(el);
};

export const showAlert = (type, msg) => {
    hideAlert();
    const markup = `
        <div class="alert alert--${type}"> <span class="alert__message">${msg}</span> </div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    console.log(document.querySelector('.alert-message'));

    window.setTimeout(hideAlert, 5000);
};

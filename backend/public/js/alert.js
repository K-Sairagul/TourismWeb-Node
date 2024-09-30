export const hideAlert = () => {
    const el = document.querySelector('.alert');
    if (el && el.parentElement) el.parentElement.removeChild(el);
};

export const showAlert = (type, msg) => {
    hideAlert();
    const markup = `
        <div class="alert alert--${type}">
            <span class="alert__message">${msg}</span>
            <button class="alert__close" onclick="document.querySelector('.alert').remove()">×</button>
        </div>
    `;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(hideAlert, 5000);
};

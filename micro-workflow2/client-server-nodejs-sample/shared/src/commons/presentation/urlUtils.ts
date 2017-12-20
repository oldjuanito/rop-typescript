export function getQueryString( field: string, url?: string ) {
    const href = url ? url : window.location.href
    const reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
    const string = reg.exec(href);
    return string ? string[1] : '';
};
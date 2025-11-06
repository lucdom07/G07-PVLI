
/*
    Esta clase está destinada únicamente al DOM. Los aliados que se muestran en el DOM, serán instancias de esta clase
*/
export default class DomAlly {

    constructor(name, texture) {
        this.name = name;
        this.texture = texture;
    }

    getName() {
        return this.name;
    }

    getTextureURL() {
        return this.texture;
    }
}
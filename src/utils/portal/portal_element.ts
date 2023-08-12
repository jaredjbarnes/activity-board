class Portal extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>
        :host {
          display: block;
          position: absolute;
          top: 0px;
          left: 0px;
          bottom: 0px;
          right: 0px;
          overflow: hidden;
          padding: 0px;
          margin: 0px;
          pointer-events: none;
        }
      
        :host > * {
          pointer-events: auto;
        }
      </style>
      <slot></slot>
    `;
  }
}

customElements.define("platform-portal", Portal);


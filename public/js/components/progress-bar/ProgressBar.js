class Progressbar {
    constructor(selector, data) {
        this.selector = selector;
        this.data = data;

        this.DOM = null;
        this.allProgressBarDOM = null;
        this.animatedElementsCount = 0;

        this.init();
    }

    init() {
        if (!this.isValidSelector() ||
            !this.isValidData()) {
            console.error('ERROR: nepraejo pirmines patikros');
            return false;
        }

        this.DOM = document.querySelector(this.selector);
        if (!this.DOM) {
            console.error('ERROR: nerestas elementas, pagal duota selector');
            return false;
        }

        this.render();
        this.addEvents();
    }

    isValidSelector() {
        if (typeof this.selector !== 'string' ||
            this.selector === '') {
            return false;
        }
        return true;
    }

    isValidData() {
        if (!Array.isArray(this.data) ||
            this.data.length === 0) {
            return false;
        }
        return true;
    }

    render() {
        let HTML = '';

        for (const bar of this.data) {
            HTML += `<div class="progress-bar">
                        <div class="top">
                            <div class="title">${bar.title}</div>
                            <div class="value">${bar.value}%</div>
                        </div>
                        <div class="bottom">
                            <div class="progress" style="width: ${bar.value}%;">
                                <div class="value"></div>
                            </div>
                        </div>
                    </div>`;
        }

        this.DOM.innerHTML += HTML;
        this.allProgressBarDOM = this.DOM.querySelectorAll('.progress-bar');
    }

    addEvents() {
        window.addEventListener('scroll', () => {
            if (this.animatedElementsCount === this.allProgressBarDOM.length) {
                return;
            }

            const screenBottom = window.scrollY + window.innerHeight;
            this.animatedElementsCount = 0;

            for (const progressBarDOM of this.allProgressBarDOM) {
                const progressBarBottom = progressBarDOM.offsetTop + progressBarDOM.offsetHeight;

                if (screenBottom >= progressBarBottom) {
                    progressBarDOM.classList.add('loading');
                    this.animatedElementsCount++;
                }
            }
        })
    }
}

export { Progressbar }
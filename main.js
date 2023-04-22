const { Plugin, MarkdownView } = require('obsidian');

class NoteCounterPlugin extends Plugin {
    async onload() {
        this.addCommand({
            id: 'insert-counter',
            name: 'Insert Counter',
            checkCallback: (checking) => {
                let view = this.app.workspace.getActiveViewOfType(MarkdownView);
                if (view) {
                    if (!checking) {
                        this.insertCounter(view);
                    }
                    return true;
                }
                return false;
            },
        });

        this.addCounterFunctionality();
    }

    async insertCounter(view) {
        const cmEditor = view.editor;
        const selectedRange = cmEditor.getSelection();
        const counterTemplate = `<!-- Counter -->
<div class="note-counter">
    <button class="note-counter-decrement">-</button>
    <span class="note-counter-display">0</span>
    <button class="note-counter-increment">+</button>
</div>
<!-- End Counter -->`;

        cmEditor.replaceSelection(counterTemplate);
    }        
        
    addCounterFunctionality() {
        const attachEventListeners = () => {
            setTimeout(() => {
                const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
                const canvasViews = this.app.workspace.getLeavesOfType('canvas');
    
                const attachClickListener = (container) => {
                    container.onclick = (event) => {
                        const incrementButton = event.target.closest('.note-counter-increment');
                        const decrementButton = event.target.closest('.note-counter-decrement');
    
                        if (incrementButton) {
                            let display = incrementButton.parentElement.querySelector('.note-counter-display');
                            display.innerText = parseInt(display.innerText) + 1;
                        } else if (decrementButton) {
                            let display = decrementButton.parentElement.querySelector('.note-counter-display');
                            display.innerText = parseInt(display.innerText) - 1;
                        }
                    };
                };
    
                if (markdownView) {
                    const previewContainer = markdownView.previewMode.containerEl;
                    attachClickListener(previewContainer);
                }
    
                if (canvasViews.length > 0) {
                    canvasViews.forEach((canvasView) => {
                        const canvasContainer = canvasView.containerEl;
                        attachClickListener(canvasContainer);
                    });
                }
            }, 100);
        };
    
        this.app.workspace.on('file-open', attachEventListeners);
        this.app.workspace.on('layout-change', attachEventListeners);
    }
    
       
}

module.exports = NoteCounterPlugin;

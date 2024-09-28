export class RangeSlider {  
    private slider: HTMLDivElement;  
    private lowerThumb: HTMLDivElement;  
    private upperThumb: HTMLDivElement;   
    private lowerThumbText: HTMLElement;   
    private upperThumbText: HTMLElement;   
    private isLowerDragging = false;  
    private isUpperDragging = false;  

    constructor(container: HTMLDivElement) {  
        this.slider = document.createElement('div');  
        this.lowerThumb = document.createElement('div');  
        this.upperThumb = document.createElement('div');  

        this.lowerThumbText = document.createElement('span');  
        this.upperThumbText = document.createElement('span');  

        this.initialize(container);  
    }  

    private initialize(container: HTMLDivElement) {  
        // Slider setup  
        this.slider.className = 'slider';  
        this.slider.style.display = 'flex';  
        this.slider.style.position = 'relative';  
        this.slider.style.height = '30px';  
        this.slider.style.backgroundColor = '#eee';  
        this.slider.style.alignItems = 'center';  
        this.slider.style.width = '100%'; // 设置为100%以适应父元素宽度   
    
        // Lower thumb setup  
        this.lowerThumb.className = 'thumb lower-thumb';  
        this.lowerThumb.style.position = 'absolute';  
        this.lowerThumb.style.left = '25%'; // Initial position  
        this.lowerThumb.style.width = '30px'; // 设置宽度  
        this.lowerThumb.draggable = true;  
        this.lowerThumbText.className = 'thumb-text'; // 添加类名可用于样式  
        this.lowerThumbText.innerHTML = '25%'; // 初始百分比  
        this.lowerThumb.appendChild(this.lowerThumbText);  
    
        // Upper thumb setup  
        this.upperThumb.className = 'thumb upper-thumb';  
        this.upperThumb.style.position = 'absolute';  
        this.upperThumb.style.left = '75%'; // Initial position  
        this.upperThumb.style.width = '30px'; // 设置宽度  
        this.upperThumb.draggable = true;  
        this.upperThumbText.className = 'thumb-text'; // 添加类名可用于样式  
        this.upperThumbText.innerHTML = '75%'; // 初始百分比  
        this.upperThumb.appendChild(this.upperThumbText);  
    
        this.slider.appendChild(this.lowerThumb);  
        this.slider.appendChild(this.upperThumb);  
        container.appendChild(this.slider);  
    
        this.addEventListeners();  
    }  

    private addEventListeners() {  
        this.lowerThumb.addEventListener('mousedown', (e) => this.onDragStart(e, true));  
        this.upperThumb.addEventListener('mousedown', (e) => this.onDragStart(e, false));  
        document.addEventListener('mousemove', (e) => this.onDragMove(e));  
        document.addEventListener('mouseup', () => this.onDragEnd());  
    }  

    private onDragStart(event: MouseEvent, isLower: boolean) {  
        event.preventDefault();  
        if (isLower) {  
            this.isLowerDragging = true;  
        } else {  
            this.isUpperDragging = true;  
        }  
    }  

    private onDragMove(event: MouseEvent) {  
        const sliderRect = this.slider.getBoundingClientRect();  
        const offsetX = event.clientX - sliderRect.left;  
        const newPosition = Math.max(0, Math.min(offsetX, sliderRect.width - 30)); // 30px is thumb width  

        if (this.isLowerDragging) {  
            const upperRect = this.upperThumb.getBoundingClientRect();  
            const upperPosition = upperRect.left - sliderRect.left;  
    
            if (newPosition < upperPosition) {  
                this.lowerThumb.style.left = `${(newPosition / sliderRect.width) * 100}%`; // 使用百分比  
                this.updateThumbText(this.lowerThumb, this.lowerThumbText, newPosition, sliderRect.width);  
            }  
        } else if (this.isUpperDragging) {  
            const lowerRect = this.lowerThumb.getBoundingClientRect();  
            const lowerPosition = lowerRect.left - sliderRect.left;  
    
            // 限制 upperThumb 的最大位置  
            const maxUpperPosition = sliderRect.width - 30; // 上限位置减去 thumb 宽度  

            if (newPosition > lowerPosition && newPosition <= maxUpperPosition) {  
                this.upperThumb.style.left = `${(newPosition / sliderRect.width) * 100}%`; // 使用百分比  
                this.updateThumbText(this.upperThumb, this.upperThumbText, newPosition, sliderRect.width);  
            }  
        }  
    }  

    private onDragEnd() {  
        this.isLowerDragging = false;  
        this.isUpperDragging = false;  
        this.updateThumbPositions(); // 更新 thumb 位置以适应父元素宽度  
    }  

    private updateThumbText(thumb: HTMLDivElement, thumbText: HTMLElement, position: number, totalWidth: number) {  
        const percentage = (position / totalWidth) * 100;  
        thumbText.innerHTML = `${Math.round(percentage)}%`; // 更新文本为当前百分比  
    }  

    private updateThumbPositions() {  
        const sliderRect = this.slider.getBoundingClientRect();  
        const lowerPosition = parseFloat(this.lowerThumb.style.left) / 100 * sliderRect.width;  
        const upperPosition = parseFloat(this.upperThumb.style.left) / 100 * sliderRect.width;  

        this.lowerThumb.style.left = `${(lowerPosition / sliderRect.width) * 100}%`;  
        this.upperThumb.style.left = `${(upperPosition / sliderRect.width) * 100}%`;  
    }  

    public getCurrentBounds(): { lower: number; upper: number } {  
        const sliderRect = this.slider.getBoundingClientRect();  
        const lowerPosition = this.lowerThumb.getBoundingClientRect().left - sliderRect.left;  
        const upperPosition = this.upperThumb.getBoundingClientRect().left - sliderRect.left;  

        return {  
            lower: (lowerPosition / sliderRect.width) * 100,  
            upper: (upperPosition / sliderRect.width) * 100,  
        };  
    }  
}
// Usage example  
// const container = document.getElementById('slider-container') as HTMLDivElement;  
// if (container) {  
//     const rangeSlider = new RangeSlider(container);  

//     // 示例：获取当前的上下界值  
//     const bounds = rangeSlider.getCurrentBounds();  
//     console.log(`Current bounds: Lower = ${bounds.lower}, Upper = ${bounds.upper}`);  
// }
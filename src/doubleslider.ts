import noUiSlider from 'nouislider';  
import 'nouislider/distribute/nouislider.css';  

interface DoubleSliderOptions {  
    container: HTMLDivElement;  
}  

class DoubleSlider {  
    private slider: noUiSlider.Instance;  
    private container: HTMLDivElement;  

    constructor(options: DoubleSliderOptions) {  
        this.container = options.container;  
        this.initializeSlider();  
    }  

    private initializeSlider() {  
        // 创建滑块  
        this.slider = noUiSlider.create(this.container, {  
            start: [20, 80], // 初始范围  
            connect: true,  
            range: {  
                min: 0,  
                max: 100,  
            },  
        });  

        // 监听滑块变化  
        this.slider.on('update', (values: string[]) => {  
            this.updateLabels(values);  
        });  

        // 创建标签显示当前百分比  
        this.createLabels();  
    }  

    private createLabels() {  
        const lowerLabel = document.createElement('div');  
        const upperLabel = document.createElement('div');  

        lowerLabel.className = 'slider-label';  
        upperLabel.className = 'slider-label';  

        this.container.appendChild(lowerLabel);  
        this.container.appendChild(upperLabel);  
    }  

    private updateLabels(values: string[]) {  
        const lowerLabel = this.container.querySelector('.slider-label:nth-child(1)');  
        const upperLabel = this.container.querySelector('.slider-label:nth-child(2)');  

        if (lowerLabel && upperLabel) {  
            lowerLabel.innerHTML = `Lower: ${Math.round(parseFloat(values[0]))}%`;  
            upperLabel.innerHTML = `Upper: ${Math.round(parseFloat(values[1]))}%`;  
        }  
    }  

    // 获取当前滑块位置  
    public getCurrentBounds(): { lower: number; upper: number } {  
        const values = this.slider.get();  
        return {  
            lower: Math.round(parseFloat(values[0])),  
            upper: Math.round(parseFloat(values[1])),  
        };  
    }  
}  

export default DoubleSlider;
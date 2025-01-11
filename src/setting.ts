import { PluginSettingTab, App, Setting } from "obsidian";
import brushtee from "./main";

export interface btsettings {  
    bank_path: string;
    api_url: string;
      api_key: string;
  }
  
  
export const DEFAULT_SETTINGS: Partial<btsettings> = {  
    bank_path: "test_bank", 
    api_url: 'https://www.gptapi.us/v1/chat/completions',
      api_key: "sk-0SghhgFMzyNOoRwG981eDcFbEeCa4aEa9c1b831bDc73360b"
  };

export class BtSettingTab extends PluginSettingTab {  
    plugin: brushtee;  
  
    constructor(app: App, plugin: brushtee) {  
        super(app, plugin);  
        this.plugin = plugin;  
    }  
  
    display(): void {  
        let { containerEl } = this;  
        containerEl.empty();  
  
        new Setting(containerEl)  
            .setName("试题库目录")  
            //.setDesc("示例：test_bank")  
            .addText((text) =>  
                text  
                    .setPlaceholder("Enter a value")  
                    .setValue(this.plugin.settings.bank_path)  
                    .onChange(async (value) => {  
                        this.plugin.settings.bank_path = value;  
                        await this.plugin.saveSettings();  
                    })  
            );  
  
        new Setting(containerEl)
          .setName('API-URL')
          .setDesc('自定义API地址')
          .addText(text => text
            .setPlaceholder('Enter your url')
            .setValue(this.plugin.settings.api_url)
            .onChange(async (value) => {
              this.plugin.settings.api_url = value;
              await this.plugin.saveSettings();
            }));
  
        new Setting(containerEl)
          .setName('API-KEY')
          .setDesc("填入API-key")
          .addText(text => text
            .setPlaceholder('Enter your api-key')
            .setValue(this.plugin.settings.api_key)
            .onChange(async (value) => {
              this.plugin.settings.api_key = value;
              await this.plugin.saveSettings();
            }));
    }  
  }  
/**
* @name UserCreateTimeAgo
* @source https://github.com/bhplugin/DiscordPlugins/blob/main/UserCreateTimeAgo/UserCreateTimeAgo.plugin.js
* @website https://discord.gg/bht
* @version 1.0.0
* @description UserCreateTimeAgo
*/
const request = require('request');
const fs = require('fs');
const path = require('path');

const config = {
    info: {
        name: 'UserCreateTimeAgo',
        authors: [
            {
                name: 'Debugger'
            }
        ],
        version: '1.0.0',
        description: 'UserCreateTimeAgo.',
        github_raw: "https://github.com/bhplugin/DiscordPlugins/blob/main/UserCreateTimeAgo/UserCreateTimeAgo.plugin.js",
    },
    
};

module.exports = !global.ZeresPluginLibrary ? class {
    constructor() {
        this._config = config;
    }

    load() {
        BdApi.showConfirmationModal('Library plugin is needed',
            `The library plugin needed for UserCreateTimeAgo is missing. Please click Download Now to install it.`, {
            confirmText: 'Download',
            cancelText: 'Cancel',
            onConfirm: () => {
                request.get('https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js', (error, response, body) => {
                    if (error)
                        return electron.shell.openExternal('https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js');

                    fs.writeFileSync(path.join(BdApi.Plugins.folder, '0PluginLibrary.plugin.js'), body);
                });
            }
        });
        
    }

    start() { }

    stop() { }

} : (([Plugin, Library]) => {
  
    const {  WebpackModules, Patcher } = Library;
    const UserModal = WebpackModules.getModule((m) => m.Z && m.Z.toString().includes('overrideAvatarDecorationURL'));

    class plugin extends Plugin {
        constructor() {
            super();
            this.getSettingsPanel = () => {
                return this.buildSettingsPanel().getElement();
            };
        }
        patchUserCreatedAt() {
          Patcher.after(UserModal, "Z", (_, [{ user, isPremium, profileType }], returnValue) => {
            try{
              let dateCreatedAt = document.getElementsByClassName("memberSinceContainer-3biwiY")[0];
              dateCreatedAt.childNodes[0].innerHTML = timeAgo(user.createdAt)
              dateCreatedAt.childNodes[1].innerHTML = timeAgo(user.createdAt)
            } catch{
            }
          });
        }
        onStart() {     
            this.patchUserCreatedAt();
        }

        onStop() {
            Patcher.unpatchAll();
        }
}

    return plugin;
})(global.ZeresPluginLibrary.buildPlugin(config));

function timeAgo(time) {

  switch (typeof time) {
    case 'number':
      break;
    case 'string':
      time = +new Date(time);
      break;
    case 'object':
      if (time.constructor === Date) time = time.getTime();
      break;
    default:
      time = +new Date();
  }
  var time_formats = [
    [60, 'seconds', 1], // 60
    [120, '1 minute ago', '1 minute from now'], // 60*2
    [3600, 'minutes', 60], // 60*60, 60
    [7200, '1 hour ago', '1 hour from now'], // 60*60*2
    [86400, 'hours', 3600], // 60*60*24, 60*60
    [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
    [604800, 'days', 86400], // 60*60*24*7, 60*60*24
    [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
    [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
    [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
    [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
    [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
    [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
    [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
    [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
  ];
  var seconds = (+new Date() - time) / 1000,
    token = 'ago',
    list_choice = 1;

  if (seconds == 0) {
    return 'Just now'
  }
  if (seconds < 0) {
    seconds = Math.abs(seconds);
    token = 'from now';
    list_choice = 2;
  }
  var i = 0,
    format;
  while (format = time_formats[i++])
    if (seconds < format[0]) {
      if (typeof format[2] == 'string')
        return format[list_choice];
      else
        return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
    }
  return time;
}

(function(){
    var script = {
 "start": "this.init()",
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "id": "rootPlayer",
 "mobileMipmappingEnabled": false,
 "vrPolyfillScale": 0.5,
 "propagateClick": false,
 "scrollBarColor": "#000000",
 "desktopMipmappingEnabled": false,
 "mouseWheelEnabled": true,
 "scrollBarOpacity": 0.5,
 "children": [
  "this.MainViewer",
  "this.Label_D6269324_C060_9559_41D1_BBC53654D2C9",
  "this.Label_DDE2B425_C1E0_735B_41A5_6BE3CC3AAE20",
  "this.Label_DB25155F_C1E1_BDE7_41D1_84139270116B",
  "this.Label_D7174F9B_C1E0_8D6F_41D5_E60EDF51D8A7",
  "this.Label_DC4526FB_C1A0_BCAE_41E5_527A199B08EF"
 ],
 "paddingRight": 0,
 "backgroundPreloadEnabled": true,
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver",
 "minHeight": 20,
 "defaultVRPointer": "laser",
 "scripts": {
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "existsKey": function(key){  return key in window; },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "registerKey": function(key, value){  window[key] = value; },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "unregisterKey": function(key){  delete window[key]; },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "getKey": function(key){  return window[key]; }
 },
 "borderSize": 0,
 "contentOpaque": false,
 "minWidth": 20,
 "horizontalAlign": "left",
 "scrollBarMargin": 2,
 "height": "100%",
 "paddingBottom": 0,
 "downloadEnabled": false,
 "class": "Player",
 "borderRadius": 0,
 "gap": 10,
 "paddingTop": 0,
 "data": {
  "name": "Player3102"
 },
 "overflow": "visible",
 "shadow": false,
 "definitions": [{
 "vfov": 180,
 "hfovMin": 60,
 "partial": false,
 "id": "media_AE96C519_BFEF_9D6B_41E1_62348B0A0CFE",
 "thumbnailUrl": "media/media_AE96C519_BFEF_9D6B_41E1_62348B0A0CFE_t.jpg",
 "label": "Kitting Hazard Perception_trim",
 "loop": false,
 "hfov": 360,
 "pitch": 0,
 "class": "Video360",
 "overlays": [
  "this.overlay_AEE59B62_BFE0_B5D9_41E4_FF749E086F4D",
  "this.overlay_D3B7E784_C060_9D5A_41DE_D31E53CC7AC7",
  "this.overlay_D3AA6A30_C061_B7BA_41DB_E07EC1106DE2",
  "this.overlay_D8FAC420_C1E0_7359_41E4_94A9EBFD6396"
 ],
 "hfovMax": 140,
 "video": [
  {
   "width": 1280,
   "url": "media/media_AE96C519_BFEF_9D6B_41E1_62348B0A0CFE.mp4",
   "framerate": 59.94,
   "bitrate": 4143,
   "type": "video/mp4",
   "class": "Video360Resource",
   "height": 720,
   "posterURL": "media/media_AE96C519_BFEF_9D6B_41E1_62348B0A0CFE_poster.jpg"
  }
 ]
},
{
 "viewerArea": "this.MainViewer",
 "class": "PanoramaPlayer",
 "displayPlaybackBar": true,
 "touchControlMode": "drag_rotation",
 "id": "MainViewerPanoramaPlayer",
 "gyroscopeVerticalDraggingEnabled": true,
 "mouseControlMode": "drag_acceleration"
},
{
 "items": [
  {
   "media": "this.media_AE96C519_BFEF_9D6B_41E1_62348B0A0CFE",
   "start": "this.MainViewerPanoramaPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.mainPlayList, 0, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.mainPlayList, 0)",
   "player": "this.MainViewerPanoramaPlayer",
   "begin": "this.fixTogglePlayPauseButton(this.MainViewerPanoramaPlayer)",
   "camera": "this.media_AE96C519_BFEF_9D6B_41E1_62348B0A0CFE_camera",
   "end": "this.trigger('tourEnded')",
   "class": "Video360PlayListItem"
  }
 ],
 "id": "mainPlayList",
 "class": "PlayList"
},
{
 "class": "RotationalCamera",
 "automaticZoomSpeed": 10,
 "manualZoomSpeed": 1,
 "automaticRotationSpeed": 10,
 "id": "media_AE96C519_BFEF_9D6B_41E1_62348B0A0CFE_camera",
 "manualRotationSpeed": 1800,
 "initialPosition": {
  "yaw": 0,
  "class": "RotationalCameraPosition",
  "hfov": 120,
  "pitch": 0
 }
},
{
 "transitionDuration": 500,
 "playbackBarHeadShadowHorizontalLength": 0,
 "progressBackgroundColorDirection": "vertical",
 "id": "MainViewer",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "playbackBarBottom": 5,
 "toolTipShadowSpread": 0,
 "playbackBarHeadOpacity": 1,
 "progressBorderColor": "#000000",
 "toolTipBorderColor": "#767676",
 "width": "100%",
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarHeadShadowVerticalLength": 0,
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "paddingLeft": 0,
 "toolTipFontSize": "1.11vmin",
 "toolTipOpacity": 1,
 "toolTipShadowBlurRadius": 3,
 "minHeight": 50,
 "toolTipTextShadowColor": "#000000",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6,
 "playbackBarRight": 0,
 "playbackBarHeight": 10,
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipTextShadowBlurRadius": 3,
 "toolTipPaddingBottom": 4,
 "minWidth": 100,
 "playbackBarProgressBorderSize": 0,
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "toolTipFontWeight": "normal",
 "height": "100%",
 "progressBarBorderSize": 0,
 "paddingBottom": 0,
 "toolTipShadowColor": "#333333",
 "playbackBarBorderRadius": 0,
 "playbackBarHeadBorderRadius": 0,
 "transitionMode": "blending",
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderColor": "#000000",
 "class": "ViewerArea",
 "toolTipFontStyle": "normal",
 "progressLeft": 0,
 "toolTipShadowHorizontalLength": 0,
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "toolTipShadowOpacity": 1,
 "playbackBarBorderSize": 0,
 "toolTipShadowVerticalLength": 0,
 "propagateClick": false,
 "playbackBarBackgroundOpacity": 1,
 "shadow": false,
 "toolTipFontFamily": "Arial",
 "vrPointerSelectionColor": "#FF6600",
 "toolTipTextShadowOpacity": 0,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarHeadShadowColor": "#000000",
 "vrPointerSelectionTime": 2000,
 "progressRight": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "paddingRight": 0,
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarHeadShadow": true,
 "progressBottom": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "toolTipFontColor": "#606060",
 "progressHeight": 10,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "borderSize": 0,
 "vrPointerColor": "#FFFFFF",
 "displayTooltipInTouchScreens": true,
 "progressBarOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBorderSize": 0,
 "toolTipBorderSize": 1,
 "toolTipPaddingRight": 6,
 "toolTipPaddingLeft": 6,
 "progressBorderRadius": 0,
 "toolTipPaddingTop": 4,
 "toolTipDisplayTime": 600,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarLeft": 0,
 "progressBackgroundColorRatios": [
  0
 ],
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "paddingTop": 0,
 "playbackBarHeadHeight": 15,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "playbackBarHeadShadowBlurRadius": 3,
 "progressBarBorderColor": "#000000",
 "data": {
  "name": "Main Viewer"
 }
},
{
 "fontFamily": "Arial",
 "propagateClick": false,
 "textDecoration": "none",
 "id": "Label_D6269324_C060_9559_41D1_BBC53654D2C9",
 "right": "3.46%",
 "fontColor": "#FFFFFF",
 "width": "15.023%",
 "paddingRight": 0,
 "textShadowHorizontalLength": 1,
 "paddingLeft": 0,
 "textShadowOpacity": 0.7,
 "text": "0",
 "top": "2.98%",
 "textShadowColor": "#000000",
 "minHeight": 1,
 "verticalAlign": "middle",
 "minWidth": 1,
 "horizontalAlign": "center",
 "height": "10%",
 "borderSize": 0,
 "fontSize": "10vmin",
 "paddingBottom": 0,
 "fontStyle": "normal",
 "backgroundOpacity": 0,
 "class": "Label",
 "borderRadius": 0,
 "textShadowBlurRadius": 3,
 "paddingTop": 0,
 "data": {
  "name": "0"
 },
 "fontWeight": "normal",
 "shadow": false,
 "textShadowVerticalLength": 1
},
{
 "fontFamily": "Arial",
 "propagateClick": false,
 "textDecoration": "none",
 "id": "Label_DDE2B425_C1E0_735B_41A5_6BE3CC3AAE20",
 "right": "3.46%",
 "fontColor": "#FFFFFF",
 "width": "15.018%",
 "paddingRight": 0,
 "textShadowHorizontalLength": 1,
 "paddingLeft": 0,
 "textShadowOpacity": 0.7,
 "text": "10",
 "top": "2.95%",
 "textShadowColor": "#000000",
 "minHeight": 1,
 "verticalAlign": "middle",
 "minWidth": 1,
 "horizontalAlign": "center",
 "height": "10%",
 "borderSize": 0,
 "fontSize": "10vmin",
 "paddingBottom": 0,
 "fontStyle": "normal",
 "backgroundOpacity": 0,
 "class": "Label",
 "borderRadius": 0,
 "textShadowBlurRadius": 3,
 "visible": false,
 "paddingTop": 0,
 "data": {
  "name": "10"
 },
 "fontWeight": "normal",
 "shadow": false,
 "textShadowVerticalLength": 1
},
{
 "fontFamily": "Arial",
 "propagateClick": false,
 "textDecoration": "none",
 "id": "Label_DB25155F_C1E1_BDE7_41D1_84139270116B",
 "right": "3.46%",
 "fontColor": "#FFFFFF",
 "width": "15.018%",
 "paddingRight": 0,
 "textShadowHorizontalLength": 1,
 "paddingLeft": 0,
 "textShadowOpacity": 0.7,
 "text": "20",
 "top": "2.95%",
 "textShadowColor": "#000000",
 "minHeight": 1,
 "verticalAlign": "middle",
 "minWidth": 1,
 "horizontalAlign": "center",
 "height": "10%",
 "borderSize": 0,
 "fontSize": "10vmin",
 "paddingBottom": 0,
 "fontStyle": "normal",
 "backgroundOpacity": 0,
 "class": "Label",
 "borderRadius": 0,
 "textShadowBlurRadius": 3,
 "visible": false,
 "paddingTop": 0,
 "data": {
  "name": "20"
 },
 "fontWeight": "normal",
 "shadow": false,
 "textShadowVerticalLength": 1
},
{
 "fontFamily": "Arial",
 "propagateClick": false,
 "textDecoration": "none",
 "id": "Label_D7174F9B_C1E0_8D6F_41D5_E60EDF51D8A7",
 "right": "3.46%",
 "fontColor": "#FFFFFF",
 "width": "15.018%",
 "paddingRight": 0,
 "textShadowHorizontalLength": 1,
 "paddingLeft": 0,
 "textShadowOpacity": 0.7,
 "text": "30",
 "top": "2.95%",
 "textShadowColor": "#000000",
 "minHeight": 1,
 "verticalAlign": "middle",
 "minWidth": 1,
 "horizontalAlign": "center",
 "height": "10%",
 "borderSize": 0,
 "fontSize": "10vmin",
 "paddingBottom": 0,
 "fontStyle": "normal",
 "backgroundOpacity": 0,
 "class": "Label",
 "borderRadius": 0,
 "textShadowBlurRadius": 3,
 "visible": false,
 "paddingTop": 0,
 "data": {
  "name": "30"
 },
 "fontWeight": "normal",
 "shadow": false,
 "textShadowVerticalLength": 1
},
{
 "fontFamily": "Arial",
 "propagateClick": false,
 "textDecoration": "none",
 "id": "Label_DC4526FB_C1A0_BCAE_41E5_527A199B08EF",
 "right": "3.46%",
 "fontColor": "#FFFFFF",
 "width": "15.018%",
 "paddingRight": 0,
 "textShadowHorizontalLength": 1,
 "paddingLeft": 0,
 "textShadowOpacity": 0.7,
 "text": "30",
 "top": "2.95%",
 "textShadowColor": "#000000",
 "minHeight": 1,
 "verticalAlign": "middle",
 "minWidth": 1,
 "horizontalAlign": "center",
 "height": "10%",
 "borderSize": 0,
 "fontSize": "10vmin",
 "paddingBottom": 0,
 "fontStyle": "normal",
 "backgroundOpacity": 0,
 "class": "Label",
 "borderRadius": 0,
 "textShadowBlurRadius": 3,
 "visible": false,
 "paddingTop": 0,
 "data": {
  "name": "40"
 },
 "fontWeight": "normal",
 "shadow": false,
 "textShadowVerticalLength": 1
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "Image"
 },
 "items": [
  {
   "playbackPositions": [
    {
     "roll": 0,
     "timestamp": 0,
     "hfov": 5.38,
     "pitch": 81.05,
     "opacity": 0,
     "yaw": -144.48,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 2,
     "hfov": 5.38,
     "pitch": 81.05,
     "opacity": 0,
     "yaw": -144.48,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 2,
     "hfov": 5.38,
     "pitch": 81.05,
     "opacity": 0,
     "yaw": -144.48,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 2.5,
     "hfov": 14.94,
     "pitch": 64.42,
     "opacity": 1,
     "yaw": -75.69,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 3,
     "hfov": 15.37,
     "pitch": 63.61,
     "opacity": 1,
     "yaw": -21,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 3.5,
     "hfov": 20.97,
     "pitch": 52.7,
     "opacity": 1,
     "yaw": 20.01,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 4,
     "hfov": 24.63,
     "pitch": 44.59,
     "opacity": 1,
     "yaw": 22.29,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 4.5,
     "hfov": 27.52,
     "pitch": 37.3,
     "opacity": 1,
     "yaw": 25.02,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 5.01,
     "hfov": 26.76,
     "pitch": 39.33,
     "opacity": 1,
     "yaw": 12.72,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 5.51,
     "hfov": 28.66,
     "pitch": 34.06,
     "opacity": 1,
     "yaw": 0.87,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 6.01,
     "hfov": 29.06,
     "pitch": 32.85,
     "opacity": 1,
     "yaw": -10.09,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 6.51,
     "hfov": 29.71,
     "pitch": 30.82,
     "opacity": 1,
     "yaw": -12.37,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 7.01,
     "hfov": 28.66,
     "pitch": 34.06,
     "opacity": 1,
     "yaw": -4.62,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 7.51,
     "hfov": 27.52,
     "pitch": 37.3,
     "opacity": 1,
     "yaw": 1.76,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 8.01,
     "hfov": 27.22,
     "pitch": 38.11,
     "opacity": 1,
     "yaw": 1.3,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 8.51,
     "hfov": 26.29,
     "pitch": 40.54,
     "opacity": 1,
     "yaw": 1.76,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 9.01,
     "hfov": 24.63,
     "pitch": 44.59,
     "opacity": 1,
     "yaw": -6.9,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 9.51,
     "hfov": 24.29,
     "pitch": 45.41,
     "opacity": 1,
     "yaw": -12.82,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 10.01,
     "hfov": 26.12,
     "pitch": 40.97,
     "opacity": 1,
     "yaw": -19.2,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 10.51,
     "hfov": 25.46,
     "pitch": 42.61,
     "opacity": 1,
     "yaw": -15.1,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 11.01,
     "hfov": 25.78,
     "pitch": 41.82,
     "opacity": 1,
     "yaw": -21.94,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 11.51,
     "hfov": 26.26,
     "pitch": 40.61,
     "opacity": 1,
     "yaw": -16.01,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 12.01,
     "hfov": 26.88,
     "pitch": 39.01,
     "opacity": 1,
     "yaw": -18.29,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 12.51,
     "hfov": 27.04,
     "pitch": 38.6,
     "opacity": 1,
     "yaw": -14.19,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 13.01,
     "hfov": 27.33,
     "pitch": 37.81,
     "opacity": 1,
     "yaw": -18.29,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 13.51,
     "hfov": 29.03,
     "pitch": 32.95,
     "opacity": 1,
     "yaw": -12.82,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 14.01,
     "hfov": 29.54,
     "pitch": 31.35,
     "opacity": 1,
     "yaw": -7.81,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 14.51,
     "hfov": 29.6,
     "pitch": 31.15,
     "opacity": 1,
     "yaw": -8.07,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 15.02,
     "hfov": 30.04,
     "pitch": 29.73,
     "opacity": 0.54,
     "yaw": 14.52,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 15.52,
     "hfov": 30.51,
     "pitch": 28.11,
     "opacity": 0,
     "yaw": 22.72,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 16.02,
     "hfov": 29.92,
     "pitch": 30.13,
     "opacity": 0,
     "yaw": 26.34,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 18.02,
     "hfov": 29.26,
     "pitch": 32.24,
     "opacity": 0,
     "yaw": 38.19,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 18.52,
     "hfov": 29.42,
     "pitch": 31.75,
     "opacity": 1,
     "yaw": 33.18,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 19.02,
     "hfov": 27.17,
     "pitch": 38.24,
     "opacity": 1,
     "yaw": 11.76,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 19.52,
     "hfov": 26.87,
     "pitch": 39.05,
     "opacity": 1,
     "yaw": 9.03,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 20.02,
     "hfov": 27.77,
     "pitch": 36.62,
     "opacity": 1,
     "yaw": 24.06,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 20.52,
     "hfov": 27.77,
     "pitch": 36.62,
     "opacity": 1,
     "yaw": 37.73,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 21.02,
     "hfov": 28.48,
     "pitch": 34.59,
     "opacity": 1,
     "yaw": 40.01,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 21.52,
     "hfov": 28.62,
     "pitch": 34.18,
     "opacity": 1,
     "yaw": 41.38,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 22.02,
     "hfov": 28.75,
     "pitch": 33.78,
     "opacity": 1,
     "yaw": 44.11,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 22.52,
     "hfov": 27.77,
     "pitch": 36.62,
     "opacity": 1,
     "yaw": 39.56,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 23.02,
     "hfov": 27.02,
     "pitch": 38.64,
     "opacity": 1,
     "yaw": 32.27,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 23.52,
     "hfov": 30.51,
     "pitch": 28.11,
     "opacity": 1,
     "yaw": 41.84,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 24.02,
     "hfov": 28.48,
     "pitch": 34.59,
     "opacity": 1,
     "yaw": 44.11,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 24.52,
     "hfov": 27.62,
     "pitch": 37.02,
     "opacity": 1,
     "yaw": 38.19,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 25.03,
     "hfov": 27.91,
     "pitch": 36.21,
     "opacity": 1,
     "yaw": 36.82,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 25.53,
     "hfov": 27.76,
     "pitch": 36.64,
     "opacity": 1,
     "yaw": 33.63,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 26.53,
     "hfov": 27.32,
     "pitch": 37.85,
     "opacity": 1,
     "yaw": 30.9,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 27.03,
     "hfov": 25.91,
     "pitch": 41.5,
     "opacity": 1,
     "yaw": 31.81,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 27.53,
     "hfov": 24.05,
     "pitch": 45.95,
     "opacity": 1,
     "yaw": 22.24,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 28.03,
     "hfov": 24.31,
     "pitch": 45.35,
     "opacity": 1,
     "yaw": 11.99,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 28.53,
     "hfov": 24.57,
     "pitch": 44.74,
     "opacity": 1,
     "yaw": 9.94,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 29.03,
     "hfov": 24.4,
     "pitch": 45.14,
     "opacity": 1,
     "yaw": 4.47,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 29.53,
     "hfov": 24.83,
     "pitch": 44.13,
     "opacity": 1,
     "yaw": 4.69,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 30.03,
     "hfov": 25.25,
     "pitch": 43.12,
     "opacity": 1,
     "yaw": 35,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 30.53,
     "hfov": 24.23,
     "pitch": 45.55,
     "opacity": 1,
     "yaw": 57.33,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 31.03,
     "hfov": 24.96,
     "pitch": 43.81,
     "opacity": 1,
     "yaw": 60.97,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 31.53,
     "hfov": 24.84,
     "pitch": 44.09,
     "opacity": 0.91,
     "yaw": 61.41,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 32.03,
     "hfov": 25.41,
     "pitch": 42.73,
     "opacity": 1,
     "yaw": 49.13,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 32.53,
     "hfov": 24.57,
     "pitch": 44.76,
     "opacity": 1,
     "yaw": 15.41,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 33.03,
     "hfov": 27.31,
     "pitch": 37.87,
     "opacity": 1,
     "yaw": 0.37,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 33.53,
     "hfov": 30.27,
     "pitch": 28.96,
     "opacity": 1,
     "yaw": 20.42,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 34.03,
     "hfov": 30.39,
     "pitch": 28.55,
     "opacity": 1,
     "yaw": 25.86,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 34.53,
     "hfov": 28.74,
     "pitch": 33.82,
     "opacity": 1,
     "yaw": 24.95,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 35.03,
     "hfov": 29.91,
     "pitch": 30.17,
     "opacity": 1,
     "yaw": 29.51,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 35.54,
     "hfov": 31.38,
     "pitch": 24.91,
     "opacity": 1,
     "yaw": 21.76,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 36.04,
     "hfov": 33.63,
     "pitch": 13.57,
     "opacity": 1,
     "yaw": 18.57,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 36.54,
     "hfov": 27.9,
     "pitch": 36.25,
     "opacity": 1,
     "yaw": 11.28,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 37.04,
     "hfov": 25.73,
     "pitch": 41.94,
     "opacity": 1,
     "yaw": -2.39,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 37.54,
     "hfov": 24.2,
     "pitch": 45.61,
     "opacity": 1,
     "yaw": 2.17,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 38.04,
     "hfov": 24.2,
     "pitch": 45.61,
     "opacity": 1,
     "yaw": 11.74,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 38.54,
     "hfov": 24.19,
     "pitch": 45.63,
     "opacity": 1,
     "yaw": 4.45,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 39.04,
     "hfov": 24.71,
     "pitch": 44.41,
     "opacity": 1,
     "yaw": 9.46,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 39.54,
     "hfov": 24.54,
     "pitch": 44.82,
     "opacity": 1,
     "yaw": 43.18,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 40.04,
     "hfov": 22,
     "pitch": 50.51,
     "opacity": 1,
     "yaw": 83.74,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 40.54,
     "hfov": 19.25,
     "pitch": 56.18,
     "opacity": 1,
     "yaw": 92.85,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 41.04,
     "hfov": 20.46,
     "pitch": 53.75,
     "opacity": 1,
     "yaw": 106.98,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 41.54,
     "hfov": 19.45,
     "pitch": 55.79,
     "opacity": 1,
     "yaw": 117.91,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 42.04,
     "hfov": 16.95,
     "pitch": 60.66,
     "opacity": 1,
     "yaw": 86.47,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 42.54,
     "hfov": 18.63,
     "pitch": 57.42,
     "opacity": 1,
     "yaw": 53.66,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 43.04,
     "hfov": 18.42,
     "pitch": 57.82,
     "opacity": 1,
     "yaw": 79.64,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 43.54,
     "hfov": 18.01,
     "pitch": 58.63,
     "opacity": 1,
     "yaw": 115.18,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 44.04,
     "hfov": 17.8,
     "pitch": 59.04,
     "opacity": 1,
     "yaw": 108.8,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 45.05,
     "hfov": 23.61,
     "pitch": 46.62,
     "opacity": 1,
     "yaw": 65.65,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 45.55,
     "hfov": 24.17,
     "pitch": 45.67,
     "opacity": 1,
     "yaw": 66.42,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 46.55,
     "hfov": 22.2,
     "pitch": 50,
     "opacity": 1,
     "yaw": 70.36,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 47.05,
     "hfov": 21.22,
     "pitch": 52.17,
     "opacity": 1,
     "yaw": 57.31,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 47.55,
     "hfov": 17.61,
     "pitch": 59.28,
     "opacity": 1,
     "yaw": 18.54,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 48.05,
     "hfov": 16.5,
     "pitch": 61.51,
     "opacity": 1,
     "yaw": -5.58,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 48.55,
     "hfov": 18.56,
     "pitch": 57.48,
     "opacity": 1,
     "yaw": -7.19,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 49.05,
     "hfov": 20.22,
     "pitch": 54.24,
     "opacity": 1,
     "yaw": -16.97,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 49.55,
     "hfov": 22.92,
     "pitch": 48.04,
     "opacity": 1,
     "yaw": 0.66,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 50.05,
     "hfov": 23.01,
     "pitch": 47.9,
     "opacity": 1,
     "yaw": -3.6,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 50.55,
     "hfov": 27.09,
     "pitch": 38.46,
     "opacity": 1,
     "yaw": 23.59,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 51.55,
     "hfov": 29.16,
     "pitch": 32.53,
     "opacity": 1,
     "yaw": 48.8,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 52.05,
     "hfov": 28.26,
     "pitch": 35.22,
     "opacity": 1,
     "yaw": 47.74,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 52.55,
     "hfov": 23.52,
     "pitch": 46.76,
     "opacity": 1,
     "yaw": 22.68,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 53.05,
     "hfov": 22.52,
     "pitch": 49.39,
     "opacity": 1,
     "yaw": 15.84,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 53.55,
     "hfov": 24.21,
     "pitch": 45.36,
     "opacity": 1,
     "yaw": -8.55,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 54.05,
     "hfov": 26.93,
     "pitch": 38.88,
     "opacity": 1,
     "yaw": 9,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 54.55,
     "hfov": 29.59,
     "pitch": 31.19,
     "opacity": 1,
     "yaw": 23.13,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 55.06,
     "hfov": 29.39,
     "pitch": 31.8,
     "opacity": 1,
     "yaw": 22.9,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 55.56,
     "hfov": 30.44,
     "pitch": 28.35,
     "opacity": 1,
     "yaw": 36.34,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 56.06,
     "hfov": 33.32,
     "pitch": 15.61,
     "opacity": 1,
     "yaw": 35.21,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 56.56,
     "hfov": 30.32,
     "pitch": 28.78,
     "opacity": 1,
     "yaw": 15.84,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 57.06,
     "hfov": 30.74,
     "pitch": 26.75,
     "opacity": 1,
     "yaw": 9.67,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 57.56,
     "hfov": 33,
     "pitch": 17.44,
     "opacity": 1,
     "yaw": 29.05,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 58.06,
     "hfov": 25.85,
     "pitch": 39.33,
     "opacity": 1,
     "yaw": 19.69,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 58.56,
     "hfov": 23.41,
     "pitch": 47.41,
     "opacity": 1,
     "yaw": 29.51,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 59.06,
     "hfov": 21.35,
     "pitch": 51.89,
     "opacity": 0.5,
     "yaw": 67.33,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 59.56,
     "hfov": 23.55,
     "pitch": 47.05,
     "opacity": 0,
     "yaw": 87.4,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 60.06,
     "hfov": 23.21,
     "pitch": 47.86,
     "opacity": 0,
     "yaw": 98.32,
     "class": "PanoramaOverlayPlaybackPosition"
    }
   ],
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/media_AE96C519_BFEF_9D6B_41E1_62348B0A0CFE_HS_0_0.png",
      "width": 123,
      "class": "ImageResourceLevel",
      "height": 104
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "yaw": 0
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_AEE59B62_BFE0_B5D9_41E4_FF749E086F4D",
 "maps": [
  {
   "playbackPositions": [
    {
     "roll": 0,
     "timestamp": 0,
     "hfov": 24.84,
     "pitch": 44.09,
     "opacity": 0,
     "yaw": 61.41,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 31.53,
     "hfov": 24.84,
     "pitch": 44.09,
     "opacity": 0,
     "yaw": 61.41,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 31.53,
     "hfov": 24.84,
     "pitch": 44.09,
     "opacity": 1,
     "yaw": 61.41,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 2.5,
     "hfov": 14.94,
     "pitch": 64.42,
     "opacity": 1,
     "yaw": -75.69,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 3,
     "hfov": 15.37,
     "pitch": 63.61,
     "opacity": 1,
     "yaw": -21,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 3.5,
     "hfov": 20.97,
     "pitch": 52.7,
     "opacity": 1,
     "yaw": 20.01,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 4,
     "hfov": 24.63,
     "pitch": 44.59,
     "opacity": 1,
     "yaw": 22.29,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 4.5,
     "hfov": 27.52,
     "pitch": 37.3,
     "opacity": 1,
     "yaw": 25.02,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 5.01,
     "hfov": 26.76,
     "pitch": 39.33,
     "opacity": 1,
     "yaw": 12.72,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 5.51,
     "hfov": 28.66,
     "pitch": 34.06,
     "opacity": 1,
     "yaw": 0.87,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 6.01,
     "hfov": 29.06,
     "pitch": 32.85,
     "opacity": 1,
     "yaw": -10.09,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 6.51,
     "hfov": 29.71,
     "pitch": 30.82,
     "opacity": 1,
     "yaw": -12.37,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 7.01,
     "hfov": 28.66,
     "pitch": 34.06,
     "opacity": 1,
     "yaw": -4.62,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 7.51,
     "hfov": 27.52,
     "pitch": 37.3,
     "opacity": 1,
     "yaw": 1.76,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 8.01,
     "hfov": 27.22,
     "pitch": 38.11,
     "opacity": 1,
     "yaw": 1.3,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 8.51,
     "hfov": 26.29,
     "pitch": 40.54,
     "opacity": 1,
     "yaw": 1.76,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 9.01,
     "hfov": 24.63,
     "pitch": 44.59,
     "opacity": 1,
     "yaw": -6.9,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 9.51,
     "hfov": 24.29,
     "pitch": 45.41,
     "opacity": 1,
     "yaw": -12.82,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 10.01,
     "hfov": 26.12,
     "pitch": 40.97,
     "opacity": 1,
     "yaw": -19.2,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 10.51,
     "hfov": 25.46,
     "pitch": 42.61,
     "opacity": 1,
     "yaw": -15.1,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 11.01,
     "hfov": 25.78,
     "pitch": 41.82,
     "opacity": 1,
     "yaw": -21.94,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 11.51,
     "hfov": 26.26,
     "pitch": 40.61,
     "opacity": 1,
     "yaw": -16.01,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 12.01,
     "hfov": 26.88,
     "pitch": 39.01,
     "opacity": 1,
     "yaw": -18.29,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 12.51,
     "hfov": 27.04,
     "pitch": 38.6,
     "opacity": 1,
     "yaw": -14.19,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 13.01,
     "hfov": 27.33,
     "pitch": 37.81,
     "opacity": 1,
     "yaw": -18.29,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 13.51,
     "hfov": 29.03,
     "pitch": 32.95,
     "opacity": 1,
     "yaw": -12.82,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 14.01,
     "hfov": 29.54,
     "pitch": 31.35,
     "opacity": 1,
     "yaw": -7.81,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 14.51,
     "hfov": 29.6,
     "pitch": 31.15,
     "opacity": 1,
     "yaw": -8.07,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 15.02,
     "hfov": 30.04,
     "pitch": 29.73,
     "opacity": 0.54,
     "yaw": 14.52,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 15.52,
     "hfov": 30.51,
     "pitch": 28.11,
     "opacity": 0,
     "yaw": 22.72,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 16.02,
     "hfov": 29.92,
     "pitch": 30.13,
     "opacity": 0,
     "yaw": 26.34,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 18.02,
     "hfov": 29.26,
     "pitch": 32.24,
     "opacity": 0,
     "yaw": 38.19,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 18.52,
     "hfov": 29.42,
     "pitch": 31.75,
     "opacity": 1,
     "yaw": 33.18,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 19.02,
     "hfov": 27.17,
     "pitch": 38.24,
     "opacity": 1,
     "yaw": 11.76,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 19.52,
     "hfov": 26.87,
     "pitch": 39.05,
     "opacity": 1,
     "yaw": 9.03,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 20.02,
     "hfov": 27.77,
     "pitch": 36.62,
     "opacity": 1,
     "yaw": 24.06,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 20.52,
     "hfov": 27.77,
     "pitch": 36.62,
     "opacity": 1,
     "yaw": 37.73,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 21.02,
     "hfov": 28.48,
     "pitch": 34.59,
     "opacity": 1,
     "yaw": 40.01,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 21.52,
     "hfov": 28.62,
     "pitch": 34.18,
     "opacity": 1,
     "yaw": 41.38,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 22.02,
     "hfov": 28.75,
     "pitch": 33.78,
     "opacity": 1,
     "yaw": 44.11,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 22.52,
     "hfov": 27.77,
     "pitch": 36.62,
     "opacity": 1,
     "yaw": 39.56,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 23.02,
     "hfov": 27.02,
     "pitch": 38.64,
     "opacity": 1,
     "yaw": 32.27,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 23.52,
     "hfov": 30.51,
     "pitch": 28.11,
     "opacity": 1,
     "yaw": 41.84,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 24.02,
     "hfov": 28.48,
     "pitch": 34.59,
     "opacity": 1,
     "yaw": 44.11,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 24.52,
     "hfov": 27.62,
     "pitch": 37.02,
     "opacity": 1,
     "yaw": 38.19,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 25.03,
     "hfov": 27.91,
     "pitch": 36.21,
     "opacity": 1,
     "yaw": 36.82,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 25.53,
     "hfov": 27.76,
     "pitch": 36.64,
     "opacity": 1,
     "yaw": 33.63,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 26.53,
     "hfov": 27.32,
     "pitch": 37.85,
     "opacity": 1,
     "yaw": 30.9,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 27.03,
     "hfov": 25.91,
     "pitch": 41.5,
     "opacity": 1,
     "yaw": 31.81,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 27.53,
     "hfov": 24.05,
     "pitch": 45.95,
     "opacity": 1,
     "yaw": 22.24,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 28.03,
     "hfov": 24.31,
     "pitch": 45.35,
     "opacity": 1,
     "yaw": 11.99,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 28.53,
     "hfov": 24.57,
     "pitch": 44.74,
     "opacity": 1,
     "yaw": 9.94,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 29.03,
     "hfov": 24.4,
     "pitch": 45.14,
     "opacity": 1,
     "yaw": 4.47,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 29.53,
     "hfov": 24.83,
     "pitch": 44.13,
     "opacity": 1,
     "yaw": 4.69,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 30.03,
     "hfov": 25.25,
     "pitch": 43.12,
     "opacity": 1,
     "yaw": 35,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 30.53,
     "hfov": 24.23,
     "pitch": 45.55,
     "opacity": 1,
     "yaw": 57.33,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 31.03,
     "hfov": 24.96,
     "pitch": 43.81,
     "opacity": 1,
     "yaw": 60.97,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 2,
     "hfov": 5.38,
     "pitch": 81.05,
     "opacity": 0,
     "yaw": -144.48,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 32.03,
     "hfov": 25.41,
     "pitch": 42.73,
     "opacity": 1,
     "yaw": 49.13,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 32.53,
     "hfov": 24.57,
     "pitch": 44.76,
     "opacity": 1,
     "yaw": 15.41,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 33.03,
     "hfov": 27.31,
     "pitch": 37.87,
     "opacity": 1,
     "yaw": 0.37,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 33.53,
     "hfov": 30.27,
     "pitch": 28.96,
     "opacity": 1,
     "yaw": 20.42,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 34.03,
     "hfov": 30.39,
     "pitch": 28.55,
     "opacity": 1,
     "yaw": 25.86,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 34.53,
     "hfov": 28.74,
     "pitch": 33.82,
     "opacity": 1,
     "yaw": 24.95,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 35.03,
     "hfov": 29.91,
     "pitch": 30.17,
     "opacity": 1,
     "yaw": 29.51,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 35.54,
     "hfov": 31.38,
     "pitch": 24.91,
     "opacity": 1,
     "yaw": 21.76,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 36.04,
     "hfov": 33.63,
     "pitch": 13.57,
     "opacity": 1,
     "yaw": 18.57,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 36.54,
     "hfov": 27.9,
     "pitch": 36.25,
     "opacity": 1,
     "yaw": 11.28,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 37.04,
     "hfov": 25.73,
     "pitch": 41.94,
     "opacity": 1,
     "yaw": -2.39,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 37.54,
     "hfov": 24.2,
     "pitch": 45.61,
     "opacity": 1,
     "yaw": 2.17,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 38.04,
     "hfov": 24.2,
     "pitch": 45.61,
     "opacity": 1,
     "yaw": 11.74,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 38.54,
     "hfov": 24.19,
     "pitch": 45.63,
     "opacity": 1,
     "yaw": 4.45,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 39.04,
     "hfov": 24.71,
     "pitch": 44.41,
     "opacity": 1,
     "yaw": 9.46,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 39.54,
     "hfov": 24.54,
     "pitch": 44.82,
     "opacity": 1,
     "yaw": 43.18,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 40.04,
     "hfov": 22,
     "pitch": 50.51,
     "opacity": 1,
     "yaw": 83.74,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 40.54,
     "hfov": 19.25,
     "pitch": 56.18,
     "opacity": 1,
     "yaw": 92.85,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 41.04,
     "hfov": 20.46,
     "pitch": 53.75,
     "opacity": 1,
     "yaw": 106.98,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 41.54,
     "hfov": 19.45,
     "pitch": 55.79,
     "opacity": 1,
     "yaw": 117.91,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 42.04,
     "hfov": 16.95,
     "pitch": 60.66,
     "opacity": 1,
     "yaw": 86.47,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 42.54,
     "hfov": 18.63,
     "pitch": 57.42,
     "opacity": 1,
     "yaw": 53.66,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 43.04,
     "hfov": 18.42,
     "pitch": 57.82,
     "opacity": 1,
     "yaw": 79.64,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 43.54,
     "hfov": 18.01,
     "pitch": 58.63,
     "opacity": 1,
     "yaw": 115.18,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 44.04,
     "hfov": 17.8,
     "pitch": 59.04,
     "opacity": 1,
     "yaw": 108.8,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 45.05,
     "hfov": 23.61,
     "pitch": 46.62,
     "opacity": 1,
     "yaw": 65.65,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 45.55,
     "hfov": 24.17,
     "pitch": 45.67,
     "opacity": 1,
     "yaw": 66.42,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 46.55,
     "hfov": 22.2,
     "pitch": 50,
     "opacity": 1,
     "yaw": 70.36,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 47.05,
     "hfov": 21.22,
     "pitch": 52.17,
     "opacity": 1,
     "yaw": 57.31,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 47.55,
     "hfov": 17.61,
     "pitch": 59.28,
     "opacity": 1,
     "yaw": 18.54,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 48.05,
     "hfov": 16.5,
     "pitch": 61.51,
     "opacity": 1,
     "yaw": -5.58,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 48.55,
     "hfov": 18.56,
     "pitch": 57.48,
     "opacity": 1,
     "yaw": -7.19,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 49.05,
     "hfov": 20.22,
     "pitch": 54.24,
     "opacity": 1,
     "yaw": -16.97,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 49.55,
     "hfov": 22.92,
     "pitch": 48.04,
     "opacity": 1,
     "yaw": 0.66,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 50.05,
     "hfov": 23.01,
     "pitch": 47.9,
     "opacity": 1,
     "yaw": -3.6,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 50.55,
     "hfov": 27.09,
     "pitch": 38.46,
     "opacity": 1,
     "yaw": 23.59,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 51.55,
     "hfov": 29.16,
     "pitch": 32.53,
     "opacity": 1,
     "yaw": 48.8,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 52.05,
     "hfov": 28.26,
     "pitch": 35.22,
     "opacity": 1,
     "yaw": 47.74,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 52.55,
     "hfov": 23.52,
     "pitch": 46.76,
     "opacity": 1,
     "yaw": 22.68,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 53.05,
     "hfov": 22.52,
     "pitch": 49.39,
     "opacity": 1,
     "yaw": 15.84,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 53.55,
     "hfov": 24.21,
     "pitch": 45.36,
     "opacity": 1,
     "yaw": -8.55,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 54.05,
     "hfov": 26.93,
     "pitch": 38.88,
     "opacity": 1,
     "yaw": 9,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 54.55,
     "hfov": 29.59,
     "pitch": 31.19,
     "opacity": 1,
     "yaw": 23.13,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 55.06,
     "hfov": 29.39,
     "pitch": 31.8,
     "opacity": 1,
     "yaw": 22.9,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 55.56,
     "hfov": 30.44,
     "pitch": 28.35,
     "opacity": 1,
     "yaw": 36.34,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 56.06,
     "hfov": 33.32,
     "pitch": 15.61,
     "opacity": 1,
     "yaw": 35.21,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 56.56,
     "hfov": 30.32,
     "pitch": 28.78,
     "opacity": 1,
     "yaw": 15.84,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 57.06,
     "hfov": 30.74,
     "pitch": 26.75,
     "opacity": 1,
     "yaw": 9.67,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 57.56,
     "hfov": 33,
     "pitch": 17.44,
     "opacity": 1,
     "yaw": 29.05,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 58.06,
     "hfov": 25.85,
     "pitch": 39.33,
     "opacity": 1,
     "yaw": 19.69,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 58.56,
     "hfov": 23.41,
     "pitch": 47.41,
     "opacity": 1,
     "yaw": 29.51,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 59.06,
     "hfov": 21.35,
     "pitch": 51.89,
     "opacity": 0.5,
     "yaw": 67.33,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 59.56,
     "hfov": 23.55,
     "pitch": 47.05,
     "opacity": 0,
     "yaw": 87.4,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 60.06,
     "hfov": 23.21,
     "pitch": 47.86,
     "opacity": 0,
     "yaw": 98.32,
     "class": "PanoramaOverlayPlaybackPosition"
    }
   ],
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/media_AE96C519_BFEF_9D6B_41E1_62348B0A0CFE_HS_0_0_0_map.gif",
      "width": 18,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "playbackPositions": [
    {
     "roll": 0,
     "timestamp": 0,
     "hfov": 14.63,
     "pitch": 27.43,
     "opacity": 0,
     "yaw": -101.08,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 3,
     "hfov": 14.63,
     "pitch": 27.43,
     "opacity": 0,
     "yaw": -101.08,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 3,
     "hfov": 14.63,
     "pitch": 27.43,
     "opacity": 0,
     "yaw": -101.08,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 5.01,
     "hfov": 16.27,
     "pitch": -9.06,
     "opacity": 0,
     "yaw": 22.82,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 5.51,
     "hfov": 16.26,
     "pitch": -9.11,
     "opacity": 0.5,
     "yaw": 10.47,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 6.01,
     "hfov": 16.22,
     "pitch": -9.96,
     "opacity": 1,
     "yaw": 7.68,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 7.01,
     "hfov": 15.99,
     "pitch": -14.02,
     "opacity": 1,
     "yaw": 13.23,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 9.01,
     "hfov": 21.36,
     "pitch": -21.36,
     "opacity": 1,
     "yaw": 18.61,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 11.01,
     "hfov": 23.91,
     "pitch": -37.59,
     "opacity": 1,
     "yaw": 33.26,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 11.51,
     "hfov": 21.92,
     "pitch": -43.42,
     "opacity": 0,
     "yaw": 42.17,
     "class": "PanoramaOverlayPlaybackPosition"
    }
   ],
   "image": "this.AnimatedImageResource_D9EABDA2_C1E1_8D59_41E2_6A40C82A2ABA",
   "pitch": 0,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_D3B7E784_C060_9D5A_41DE_D31E53CC7AC7",
 "data": {
  "label": "Circle Generic 01"
 },
 "areas": [
  {
   "click": "this.setComponentVisibility(this.Label_D6269324_C060_9559_41D1_BBC53654D2C9, false, 0, null, null, false); this.setComponentVisibility(this.Label_DB25155F_C1E1_BDE7_41D1_84139270116B, false, 0, null, null, false); this.setComponentVisibility(this.Label_D7174F9B_C1E0_8D6F_41D5_E60EDF51D8A7, false, 0, null, null, false); this.setComponentVisibility(this.Label_DDE2B425_C1E0_735B_41A5_6BE3CC3AAE20, true, 0, null, null, false); this.overlay_D3B7E784_C060_9D5A_41DE_D31E53CC7AC7.set('enabled', false)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "maps": [
  {
   "playbackPositions": [
    {
     "roll": 0,
     "timestamp": 0,
     "hfov": 14.63,
     "pitch": 27.43,
     "opacity": 0,
     "yaw": -101.08,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 3,
     "hfov": 14.63,
     "pitch": 27.43,
     "opacity": 0,
     "yaw": -101.08,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 3,
     "hfov": 14.63,
     "pitch": 27.43,
     "opacity": 0,
     "yaw": -101.08,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 5.01,
     "hfov": 16.27,
     "pitch": -9.06,
     "opacity": 0,
     "yaw": 22.82,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 5.51,
     "hfov": 16.26,
     "pitch": -9.11,
     "opacity": 0.5,
     "yaw": 10.47,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 6.01,
     "hfov": 16.22,
     "pitch": -9.96,
     "opacity": 1,
     "yaw": 7.68,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 7.01,
     "hfov": 15.99,
     "pitch": -14.02,
     "opacity": 1,
     "yaw": 13.23,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 9.01,
     "hfov": 21.36,
     "pitch": -21.36,
     "opacity": 1,
     "yaw": 18.61,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 11.01,
     "hfov": 23.91,
     "pitch": -37.59,
     "opacity": 1,
     "yaw": 33.26,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 11.51,
     "hfov": 21.92,
     "pitch": -43.42,
     "opacity": 0,
     "yaw": 42.17,
     "class": "PanoramaOverlayPlaybackPosition"
    }
   ],
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/media_AE96C519_BFEF_9D6B_41E1_62348B0A0CFE_HS_1_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "playbackPositions": [
    {
     "roll": 0,
     "timestamp": 0,
     "hfov": 20.12,
     "pitch": 11.82,
     "opacity": 0,
     "yaw": 8.91,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 10.01,
     "hfov": 20.12,
     "pitch": 11.82,
     "opacity": 0,
     "yaw": 8.91,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 10.01,
     "hfov": 20.12,
     "pitch": 11.82,
     "opacity": 0,
     "yaw": 8.91,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 11.01,
     "hfov": 20.18,
     "pitch": 11.01,
     "opacity": 1,
     "yaw": 13.92,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 12.01,
     "hfov": 20.23,
     "pitch": 10.2,
     "opacity": 1,
     "yaw": 18.94,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 13.51,
     "hfov": 28.52,
     "pitch": 11.74,
     "opacity": 1,
     "yaw": 37.8,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 14.51,
     "hfov": 36.17,
     "pitch": 12.82,
     "opacity": 1,
     "yaw": 63.82,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 15.52,
     "hfov": 44.38,
     "pitch": 9.81,
     "opacity": 1,
     "yaw": 103.61,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 17.02,
     "hfov": 43.8,
     "pitch": 13.46,
     "opacity": 0,
     "yaw": 179.71,
     "class": "PanoramaOverlayPlaybackPosition"
    }
   ],
   "image": "this.AnimatedImageResource_D8230C24_C1E1_F359_41A8_28EF515B6784",
   "pitch": 0,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_D3AA6A30_C061_B7BA_41DB_E07EC1106DE2",
 "data": {
  "label": "Circle Generic 02"
 },
 "areas": [
  {
   "click": "this.setComponentVisibility(this.Label_D6269324_C060_9559_41D1_BBC53654D2C9, false, 0, null, null, false); this.setComponentVisibility(this.Label_DDE2B425_C1E0_735B_41A5_6BE3CC3AAE20, false, 0, null, null, false); this.setComponentVisibility(this.Label_D7174F9B_C1E0_8D6F_41D5_E60EDF51D8A7, false, 0, null, null, false); this.setComponentVisibility(this.Label_DB25155F_C1E1_BDE7_41D1_84139270116B, true, 0, null, null, false); this.overlay_D3AA6A30_C061_B7BA_41DB_E07EC1106DE2.set('enabled', false)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "maps": [
  {
   "playbackPositions": [
    {
     "roll": 0,
     "timestamp": 0,
     "hfov": 20.12,
     "pitch": 11.82,
     "opacity": 0,
     "yaw": 8.91,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 10.01,
     "hfov": 20.12,
     "pitch": 11.82,
     "opacity": 0,
     "yaw": 8.91,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 10.01,
     "hfov": 20.12,
     "pitch": 11.82,
     "opacity": 0,
     "yaw": 8.91,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 11.01,
     "hfov": 20.18,
     "pitch": 11.01,
     "opacity": 1,
     "yaw": 13.92,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 12.01,
     "hfov": 20.23,
     "pitch": 10.2,
     "opacity": 1,
     "yaw": 18.94,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 13.51,
     "hfov": 28.52,
     "pitch": 11.74,
     "opacity": 1,
     "yaw": 37.8,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 14.51,
     "hfov": 36.17,
     "pitch": 12.82,
     "opacity": 1,
     "yaw": 63.82,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 15.52,
     "hfov": 44.38,
     "pitch": 9.81,
     "opacity": 1,
     "yaw": 103.61,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 17.02,
     "hfov": 43.8,
     "pitch": 13.46,
     "opacity": 0,
     "yaw": 179.71,
     "class": "PanoramaOverlayPlaybackPosition"
    }
   ],
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/media_AE96C519_BFEF_9D6B_41E1_62348B0A0CFE_HS_2_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "playbackPositions": [
    {
     "roll": 0,
     "timestamp": 0,
     "hfov": 15.78,
     "pitch": -13.55,
     "opacity": 0,
     "yaw": 30.66,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 19.02,
     "hfov": 15.78,
     "pitch": -13.55,
     "opacity": 0,
     "yaw": 30.66,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 19.02,
     "hfov": 15.78,
     "pitch": -13.55,
     "opacity": 0,
     "yaw": 30.66,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 19.52,
     "hfov": 15.74,
     "pitch": -14.03,
     "opacity": 1,
     "yaw": 31.55,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 20.02,
     "hfov": 15.69,
     "pitch": -14.51,
     "opacity": 0.94,
     "yaw": 32.43,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 20.52,
     "hfov": 15.65,
     "pitch": -14.99,
     "opacity": 0,
     "yaw": 33.32,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 21.52,
     "hfov": 15.57,
     "pitch": -15.95,
     "opacity": 1,
     "yaw": 35.09,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 23.02,
     "hfov": 15.3,
     "pitch": -18.95,
     "opacity": 1,
     "yaw": 38.74,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 26.53,
     "hfov": 15.27,
     "pitch": -19.54,
     "opacity": 1,
     "yaw": 39.26,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 28.53,
     "hfov": 15.09,
     "pitch": -21.57,
     "opacity": 1,
     "yaw": 42.45,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 29.03,
     "hfov": 15.21,
     "pitch": -20.46,
     "opacity": 1,
     "yaw": 42.45,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 29.53,
     "hfov": 15.17,
     "pitch": -20.83,
     "opacity": 1,
     "yaw": 43.28,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 30.03,
     "hfov": 15.13,
     "pitch": -21.2,
     "opacity": 0,
     "yaw": 44.12,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 32.03,
     "hfov": 14.97,
     "pitch": -22.68,
     "opacity": 0,
     "yaw": 47.46,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 32.53,
     "hfov": 14.97,
     "pitch": -22.68,
     "opacity": 1,
     "yaw": 47.46,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 33.03,
     "hfov": 14.85,
     "pitch": -23.74,
     "opacity": 1,
     "yaw": 48.53,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 34.53,
     "hfov": 14.47,
     "pitch": -26.92,
     "opacity": 1,
     "yaw": 51.72,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 36.04,
     "hfov": 12.78,
     "pitch": -38.06,
     "opacity": 1,
     "yaw": 69.52,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 37.04,
     "hfov": 15.37,
     "pitch": -48.66,
     "opacity": 1,
     "yaw": 88.84,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 38.54,
     "hfov": 8.86,
     "pitch": -74.06,
     "opacity": 1,
     "yaw": 139.95,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 39.54,
     "hfov": 0.07,
     "pitch": -89.88,
     "opacity": 0,
     "yaw": 179.31,
     "class": "PanoramaOverlayPlaybackPosition"
    }
   ],
   "image": "this.AnimatedImageResource_DEDA22E7_C1A0_94A7_41E4_D0B010FBDAD3",
   "pitch": 0,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_D8FAC420_C1E0_7359_41E4_94A9EBFD6396",
 "data": {
  "label": "Circle Generic 03"
 },
 "areas": [
  {
   "click": "this.setComponentVisibility(this.Label_D6269324_C060_9559_41D1_BBC53654D2C9, false, 0, null, null, false); this.setComponentVisibility(this.Label_DDE2B425_C1E0_735B_41A5_6BE3CC3AAE20, false, 0, null, null, false); this.setComponentVisibility(this.Label_DB25155F_C1E1_BDE7_41D1_84139270116B, false, 0, null, null, false); this.setComponentVisibility(this.Label_D7174F9B_C1E0_8D6F_41D5_E60EDF51D8A7, true, 0, null, null, false); this.overlay_D8FAC420_C1E0_7359_41E4_94A9EBFD6396.set('enabled', false)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "maps": [
  {
   "playbackPositions": [
    {
     "roll": 0,
     "timestamp": 0,
     "hfov": 15.78,
     "pitch": -13.55,
     "opacity": 0,
     "yaw": 30.66,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 19.02,
     "hfov": 15.78,
     "pitch": -13.55,
     "opacity": 0,
     "yaw": 30.66,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 19.02,
     "hfov": 15.78,
     "pitch": -13.55,
     "opacity": 0,
     "yaw": 30.66,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 19.52,
     "hfov": 15.74,
     "pitch": -14.03,
     "opacity": 1,
     "yaw": 31.55,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 20.02,
     "hfov": 15.69,
     "pitch": -14.51,
     "opacity": 0.94,
     "yaw": 32.43,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 20.52,
     "hfov": 15.65,
     "pitch": -14.99,
     "opacity": 0,
     "yaw": 33.32,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 21.52,
     "hfov": 15.57,
     "pitch": -15.95,
     "opacity": 1,
     "yaw": 35.09,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 23.02,
     "hfov": 15.3,
     "pitch": -18.95,
     "opacity": 1,
     "yaw": 38.74,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 26.53,
     "hfov": 15.27,
     "pitch": -19.54,
     "opacity": 1,
     "yaw": 39.26,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 28.53,
     "hfov": 15.09,
     "pitch": -21.57,
     "opacity": 1,
     "yaw": 42.45,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 29.03,
     "hfov": 15.21,
     "pitch": -20.46,
     "opacity": 1,
     "yaw": 42.45,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 29.53,
     "hfov": 15.17,
     "pitch": -20.83,
     "opacity": 1,
     "yaw": 43.28,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 30.03,
     "hfov": 15.13,
     "pitch": -21.2,
     "opacity": 0,
     "yaw": 44.12,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 32.03,
     "hfov": 14.97,
     "pitch": -22.68,
     "opacity": 0,
     "yaw": 47.46,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 32.53,
     "hfov": 14.97,
     "pitch": -22.68,
     "opacity": 1,
     "yaw": 47.46,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 33.03,
     "hfov": 14.85,
     "pitch": -23.74,
     "opacity": 1,
     "yaw": 48.53,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 34.53,
     "hfov": 14.47,
     "pitch": -26.92,
     "opacity": 1,
     "yaw": 51.72,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 36.04,
     "hfov": 12.78,
     "pitch": -38.06,
     "opacity": 1,
     "yaw": 69.52,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 37.04,
     "hfov": 15.37,
     "pitch": -48.66,
     "opacity": 1,
     "yaw": 88.84,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 38.54,
     "hfov": 8.86,
     "pitch": -74.06,
     "opacity": 1,
     "yaw": 139.95,
     "class": "PanoramaOverlayPlaybackPosition"
    },
    {
     "roll": 0,
     "timestamp": 39.54,
     "hfov": 0.07,
     "pitch": -89.88,
     "opacity": 0,
     "yaw": 179.31,
     "class": "PanoramaOverlayPlaybackPosition"
    }
   ],
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/media_AE96C519_BFEF_9D6B_41E1_62348B0A0CFE_HS_3_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0
  }
 ]
},
{
 "rowCount": 5,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/media_AE96C519_BFEF_9D6B_41E1_62348B0A0CFE_HS_1_0.png",
   "width": 1080,
   "class": "ImageResourceLevel",
   "height": 1350
  }
 ],
 "colCount": 4,
 "id": "AnimatedImageResource_D9EABDA2_C1E1_8D59_41E2_6A40C82A2ABA",
 "frameCount": 20,
 "frameDuration": 41
},
{
 "rowCount": 5,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/media_AE96C519_BFEF_9D6B_41E1_62348B0A0CFE_HS_2_0.png",
   "width": 1080,
   "class": "ImageResourceLevel",
   "height": 1350
  }
 ],
 "colCount": 4,
 "id": "AnimatedImageResource_D8230C24_C1E1_F359_41A8_28EF515B6784",
 "frameCount": 20,
 "frameDuration": 41
},
{
 "rowCount": 5,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/media_AE96C519_BFEF_9D6B_41E1_62348B0A0CFE_HS_3_0.png",
   "width": 1080,
   "class": "ImageResourceLevel",
   "height": 1350
  }
 ],
 "colCount": 4,
 "id": "AnimatedImageResource_DEDA22E7_C1A0_94A7_41E4_D0B010FBDAD3",
 "frameCount": 20,
 "frameDuration": 41
}],
 "width": "100%",
 "layout": "absolute"
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();

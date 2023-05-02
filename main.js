Game.registerMod("nonotifs",{
	init:function(){
		Game.Notify(`No Notifications mod loaded!`, `Will take effect in a second`);
		this.keep_achievements=0;
		this.setup_menu();
		setTimeout(()=>{
			this.loop();
		},500);
	},
	save:function(){
		return String(this.keep_achievements);
	},
	load:function(str){
		this.keep_achievements=parseInt(str||0);
	},
	button: function (button, text, callback) {
		if (!callback) callback = '';
		callback += "PlaySound('snd/tick.mp3');";
		return (
		  '<a class="smallFancyButton option on" id="' +
		  button +
		  '"' +
		  loc(Game.clickStr) +
		  '="' +
		  callback +
		  '">' +
		  text +
		  '</a>'
		);
	},
	menu_look: function () {
		var text = "";
		if(this.keep_achievements == 0){
			text = "OFF";
		}
		else{
			text = "ON";
		}
		return (
		  '<div class="title">' +
		  loc('No Notifications') +
		  '</div>' +
		  '<div class="listing">' +
			'<label>Ignore achievements when clearing notifications:</label><br>'
		  +
		  this.button('nonotifstoggle', text, 'Game.mods.nonotifs.update_switch();') +
		  '<br>' +
		  '</div>'
		);
	},
	setup_menu:function(){
		const oldMenu = Game.UpdateMenu;
		const MOD = this;
		Game.UpdateMenu = function () {
			oldMenu();
			if (Game.onMenu == 'prefs') {
			  let menuHTML = l('menu').innerHTML;
			  menuHTML = menuHTML.replace(
				'<div style="height:128px;"></div>',
				'<div class="block" style="padding:0px;margin:8px 4px;"><div class="subsection" style="padding:0px;">' +
				  MOD.menu_look() +
				  '</div></div><div style="height:128px;"></div>'
			  );
			  menu.innerHTML = menuHTML;
			}
		};
	},
	update_switch:function(){
		if(this.keep_achievements == 0){
			l("nonotifstoggle").innerHTML = "ON";
			this.keep_achievements = 1;
		}
		else{
			l("nonotifstoggle").innerHTML = "OFF";
			this.keep_achievements = 0;
		}
	},
	loop:function(){
		setInterval(()=>{
			this.notes();
		},500);
	},
	notes:function(){
		if(this.keep_achievements == 0){
			var how_much_notifs = Game.Notes;
			how_much_notifs = how_much_notifs.length;
			for(var i = 0; how_much_notifs >= i; i++){
				Game.CloseNote(1);
			}
		}
		else{
			var how_many_children = document.getElementById("notes").childElementCount;
			var children = document.getElementById("notes").childNodes;
			var ids = [];
			for (var i = 0; i < how_many_children; i++) {
			  try {
				var id = children[i].getAttribute("id");
				if (id == null) {
				  throw new Error("No id");
				}
				try {
				  var check = children[i].getAttribute("onmouseover");
				  if (check == null) {
					throw new Error("No attribute");
				  }
				} catch (error) {
				  ids.push(Number(id.replace("note-", "")));
				}
			  } catch (error) {
				console.log("Child " + i + " has no id");
			  }
			}
			for (var i = 0; i < ids.length; i++) {
			  Game.CloseNote(ids[i]);
			}
		}
	}
});
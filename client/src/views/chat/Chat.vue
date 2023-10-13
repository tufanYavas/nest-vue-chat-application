<template>
<div>


<!-- 
	// TODO Odaları çek 
	// TODO Ayarları çek 
-->


<div id="wrapper">
	
	<div id="topbar" :style="{'background-color': settings.themeColor}">
		
		<div id="logo">
			<img :src="settings.logo" width="110" height="50"  alt="Logo"/>
		</div>
		
		<div id="status">
			<div class="container">
				<span class="small"><i class="fa fa-chevron-down" aria-hidden="true"></i> Durumunuz</span><br>
				<div id="currentStatus">
					Çevrimiçi
				</div>
			</div>
			<ul id="statusmenu">
				<!-- // TODO Status -->
				
			</ul>
		</div>
		
		<div id="settings">
			<i id="settingsOpener" class="fa fa-cog" aria-hidden="true"></i>
			<ul id="settingsmenu">
				<!-- <%
				if(konsoloos == 1 ) {
				%>
					<a href="" onclick="showKonsolPanel(); return false;" title="Konsol Paneli"><li><i class="fa fa-hand-peace-o" aria-hidden="true"></i> Konsol Paneli</li></a>
				
				<%
				}
				
				if(usertype >= 1) {
				%>
					<a href="" onclick="showUserProfile(); return false;" title="Profil Ayarları"><li><i class="fa fa-user"></i> Profil Ayaları</li></a>
				<%
				}				
				%>

				<%
					if(usertype == 0)
					{
				%>
					<a href="#" onclick="eb_register_form(); return false;" title="Kayıt Ol"><li><i class="fa fa-clipboard"></i> Kayıt Ol</li></a>
				<%
					}
				%>
				<a class="d-hidden" href="" onclick="showPrivateMessages(); return false;" title="Mesaj Kutusu"><li><i class="fa fa-comments-o" aria-hidden="true"></i> Mesaj Kutusu (<span class="messagecounter" id="messagecounter">0</span>)</li></a>
				
				<a href="" onclick="showMicCamSettings(); return false;" title="Mikrofon/Kamera Ayarları"><li><i class="fa fa-cog"></i> Mikrofon/Kamera</li></a>
				
				
				<%
					if(sendToAll == 1)
					{
				%>
					<a href="#" onclick="sendToAll(); return false;"><li><i class="fa fa-comment"></i> Tüm odalara mesaj</li></a>
				<%
					}
				%>
					
				<a href="#" onclick="resetChat(); return false;"><li><i class="fa fa-times"></i> Mesajları sil</li></a>

				

				<%
					if(resetChatForAll == 1)
					{
				%>
					<a href="#" onclick="_resetChatForAll(); return false;"><li><i class="fa fa-users"></i> Tüm ekranlarda sil</li></a>
				<%
					}
				%> -->

				<a href="#"><li>
					<div>
					<div style="width: 100px;" class="oo-switch">	
						<i class="fa fa-cog"></i> Giriş ve çıkışları göster
					</div>
					<div style="margin-top: 10px;" class="oo-switch2">
						<div class="onoffswitch">				
							<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="showSystemMessages" checked>
							<label class="onoffswitch-label" for="showSystemMessages"></label>
						</div>
					</div>
				</div>
				</li></a>
				
				<a href="/logout" title="Çıkış yap"><li><i class="fa fa-sign-out"></i> Çıkış Yap</li></a>
			</ul>
		</div>
		
		
		<div onclick="showPrivateMessages();" id="messagebox" class="pmboxmobile">
			<i class="fa fa-comments-o" aria-hidden="true"></i>
			<div class="messagecounter" id="messagecounter">0</div>
		</div>
		
		<div id="profile">
			<div onclick="showPrivateMessages();" id="messagebox">
				<i class="fa fa-comments-o" aria-hidden="true"></i>
				<div class="messagecounter" id="messagecounter">0</div>
			</div>			
			<div class="profile-name">
				<!-- <span><%=username%></span><br><span class="small">
					<%=rutbeler[usertype]%>
				</span> -->
			</div>
			<div class="profile-image">
					<!-- <form onsubmit="return false;" id="upload" action="" method="post" enctype="multipart/form-data">
						<input id="uploadfile" name="uploadfile" type="file">
						<%if(profileimage != null) {
						%>
							<label for="uploadfile"><img src="images/profiles/<%=profileimage%>" width="46" height="46" alt="<%=username%>"/></label>
						<%} else if(gender == 0) {
						%>
							<label for="uploadfile"><img src="images/man-profile.png" width="46" height="46" alt="<%=username%>"/></label>
						<%}
						else {
						%>
							<label for="uploadfile"><img src="images/woman-profile.png" width="46" height="46" alt="<%=username%>"/></label>
						<%
						}
						%>
					</form> -->
			</div>
		</div>
		
	</div>
	
	<div id="left">
		<div id="roominfo">
			<div id="selection">
				<ul>
					<li id="showChat" class="md-hidden m-active"><i class="fa fa-commenting" aria-hidden="true"></i> Sohbet</li>
					<li id="showRooms"><i class="fa fa-telegram" aria-hidden="true"></i> Odalar</li>
					<li id="showAllUsers"><i class="fa fa-users"></i> Tüm Kişiler (<span style="cursor: pointer;" id="whole">0</span>)</li>
					<li id="showUsers"  class="active"> <i class="fa fa-users"></i> Oda (<span style="cursor: pointer;" id="wholeroom">0</span>)</li>
				</ul>
			</div>
			
			<div id="roomlist">
				<i style="margin: 0 0 0 10px" class="fa fa-search"></i><input class="search" id="roomsearch" type="text" placeholder="Oda ara...">
				
				<!-- <%
				if(typeof rooms !== "undefined"
				&& rooms.length > 0) {
					for(i = 0; i < rooms.length; i++) {			
				%>
				<div data-row="<%=i%>" data-name="<%=rooms[i].name%>" id="room<%=rooms[i].id%>" data-password="<%=(rooms[i].password=="" || rooms[i].password == null)?"false":"true"%>" data-default="<%=rooms[i].default2%>" class="room<%=(rooms[i].default2 == 1 ? " active" : "")%>">
					<div class="name">
						<i class="fa fa-comment-o" aria-hidden="true"></i> <%=rooms[i].name%>
					</div>
					<div class="online">
						<% if(rooms[i].password!="" && rooms[i].password != null) { %><i class="fa fa-lock"></i> <% } %>
						<i class="fa fa-group"></i> <span class="roomCount" data-name="<%=rooms[i].name%>">0</span>
					</div>
				</div>
				<%
					}
				}
				%>
				 -->
			</div>
			
			<div id="userlist">	
				<i style="margin: 0 0 0 10px" class="fa fa-search"></i><input class="search" id="usersearch" type="text" placeholder="Oda kişilerinde ara">
			</div>
			<div id="alluserlist">	
				<i style="margin: 0 0 0 10px" class="fa fa-search"></i><input class="search" id="userAllsearch" type="text" placeholder="Tüm kişilerde ara">
			</div>
		</div>
		<div id="profileinfo">
			<div class="goback">
				<span onclick="showRoomInfo();"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Kullanıcı Profili</span>
			</div>
			<div class="uprofile">
				<h3><i class="fa fa-user"></i> Profil görüntüleniyor</h3>
				<div class="image">
					
				</div>
				<div class="name">
					
				</div>
				<div class="status">
					<span class="sinfo"></span><br><span class="createdDate"></span>
				</div>
				<div class="uactions">
					<ul>
						<li id="privateMessage" class="privateMessage" onclick="privateMessage();"><i class="fa fa-comment"></i> Özel Mesaj</li>
						<li id="micCall" class="micCall" onclick="micCall();"><i class="fa fa-microphone"></i> Sesli Arama</li>
						<li id="webcamCall" class="webcamCall" onclick="webcamCall();"><i class="fa fa-video-camera"></i> Görüntülü Arama</li>
						<li id="banUser" onclick="banUser();"><i class="fa fa-ban"></i> Engelle</li>
						<li id="reportUser" onclick="report();"><i class="fa fa-flag"></i> Şikayet Et</li>
					</ul>
				</div>
				<div class="about">
					<h4><i class="fa fa-question-circle"></i> Hakkında:</h4>
					<div class="uinfo">						
					</div>
				</div>
			</div>
		</div>
		<div id="privatemessages">
			<div class="goback">
				<span onclick="showRoomInfo();"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Mesaj Kutusu</span>
			</div>
			<div id="messagesContainer">
				<div id="nomessage" class="message">
					<i class="fa fa-exclamation-triangle"></i> Mesaj kutusunuz boş
				</div>
			</div>
		</div>
	</div>
	
	<div id="right" class="transparentbackground" style="
	background-image: url(<% if(typeof rooms !== 'undefined' && rooms.length > 0) { %> <%= rooms[0]['bg'] %> <% } %>);	
	">
		<div id="room">
			<div class="inner">
				<div id="roomname">
				</div>
				<div id="roomslogan">
				</div>
			</div>
		</div>
		
		<div id="chat">			
		</div>		
		
		<div id="send">
			
			<div class="inner">		
								
				<input id="messageinput" type="text" placeholder="&#xf27b; Mesajınızı buraya yazın...">
				
				<div class="actions">
					<ul>									
						<li id="actionmenu">
							<span id="mic" title="Mikrofon">
								<i id="micload" class="fa fa-microphone" aria-hidden="true"></i>
							</span>
							<!-- <span id="broadcast" title="Yayına Katıl">
								<i id="broadcastload" class="fas fa-broadcast-tower" aria-hidden="true"></i>
							</span> -->
							<span id="webcam" title="Kamera">
								<i id="webcamload" class="fa fa-video-camera" aria-hidden="true"></i>
							</span>
							<span id="mmute" title="Mikrofonu Sessiz'e al">
								<i class="fa fa-volume-off" aria-hidden="true"></i>
							</span>
							<span id="showAll" title="Menü">
								<i style="margin-top: 15px;" class="fa fa-chevron-up" aria-hidden="true"></i>
							</span>
							<span class="showm">
								<span id="isend" title="Fotoğraf gönder">
									<form style="display: inline-block;" onsubmit="return false;" id="iuploader" action="" method="post" enctype="multipart/form-data">
										<label for="iupload">
											<i id="rowimage" class="fa fa-image" aria-hidden="true"></i>
											<input type="file" id="iupload" name="iupload"> <span class="show-xs">Resim gönder</span>
										</label>										
									</form>
								</span>
								<span id="mrow" title="Mikrofon sırası">
									<i id="rowload" class="fa fa-hand-paper-o" aria-hidden="true"></i> <span class="show-xs">Mikrofon Sırası</span>
								</span>							
								<span id="radiolabel" title="Radyo">
									<i id="radioload" class="fa fa-music" aria-hidden="true"></i> <span class="show-xs">Radyo</span>
								</span>							
								<span id="record" title="Ses kaydı göndermek için basılı tutun">
									<i class="fa fa-file-audio-o" aria-hidden="true"></i> <span class="show-xs">Ses kaydı</span>
								</span>
								<span id="fonttype" title="Yazı tipiniz">
									<i class="fa fa-font"></i> <span class="show-xs">Yazı tipi</span>
								</span>
							</span>
						</li>
						<li><div id="standalone" data-emoji-placeholder=":smiley:"></div></li>
					</ul>
				</div>
				
				<button id="sendmsg" style="background-color: <%=settings['tema_color']%>;" onclick="sendMessage();"><i class="fa fa-paper-plane"></i></button>
				
				
				
							</div>
			</div>
	</div>
	
</div>

<div id="lightbox" v-if="isLoading">
	<div id="loader">
		<img src="./assets/images/loader.gif" width="100" alt="Yükleniyor..."/>
	</div>
</div>

<div id="alertbox"></div>

<audio id="eb-sound" style="display:none;" type="audio/ogg"></audio>


<!-- 
<script src="js/jquery-3.4.1.min.js"></script>
<script src="js/emojionearea.min.js"></script>
<script src="js/angura.min.js"></script>
<script src="js/adapter.js"></script>
<script src="js/sweetalert.min.js"></script>
<script src="js/socket.io.js"></script>
<script src="js/jquery-ui.min.js"></script>
<script src="js/touch.js"></script>
<script src="js/recorder.js"></script>
<script type="text/javascript" src="js/jquery.touchSwipe.min.js"></script>
<script src="js/custom.min.js?v=3.6.6"></script>
<script src="js/bootstrap.min.js"></script> -->



</div>
</template>

<script lang="ts">
import axios from 'axios';
import Swal from 'sweetalert2';
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'Chat',
	data() {
		return {
			settings: {
				themeColor: '#000000',
				logo: 'logo.png',
			},
			isLoading: true
		};
	},
	props: {},
	methods: {},
	mounted() {
		this.isLoading = false;
	}
});
</script>


<style scoped>
@import 'assets/fontawesome/css/all.css';
@import 'assets/css/reset.css';
@import 'assets/css/emojionearea.min.css';
@import 'assets/css/font-awesome.min.css';
@import 'assets/css/sweetalert.min.css';
@import 'assets/css/jquery-ui.css';
@import 'assets/css/style.css';
</style>
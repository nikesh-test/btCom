<!doctype html>
<!--[if lt IE 7]> <html ng-app="budstime" class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]>    <html ng-app="budstime" class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html ng-app="budstime" class="no-js lt-ie9" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html ng-app="budstime" class="no-js" lang="en"> <!--<![endif]-->
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

	<title>Budstime</title>

	<!-- meta -->
	<meta name="description" content="">
	<meta name="author" content="">
	<meta name="viewport" content="width=device-width">

	<!-- author -->
	<link type="text/plain" rel="author" href="humans.txt" />

	<!-- main style -->
	<link href='http://fonts.googleapis.com/css?family=Signika:400,300,600,700' rel='stylesheet' type='text/css'>
	<!-- <link href='http://fonts.googleapis.com/css?family=Open+Sans:400,700,600,300' rel='stylesheet' type='text/css'> -->
	
	<link rel="stylesheet" href="css/style.css">

	<!-- modernizr -->
	<script src="js/libs/modernizr-2.5.3.min.js"></script>

	<!--[if lt IE 9]>
	<script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
	<![endif]-->

	<!-- GA -->
	<script>
		// var _gaq = _gaq || [];
		// _gaq.push(['_setAccount', 'UA-XXXXXXXX-1']);
		// _gaq.push(['_setDomainName', 'exemple.com']);
		// _gaq.push(['_setAllowLinker', true]);
		// _gaq.push(['_trackPageview']);

		// (function() {
		// var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		// ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		// var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
		// })();
	</script>
</head>
<body>
<p class="hide"><a href="#main-content" tabindex="1">Skip navigation and go to the content</a></p>
<div id="main-content" role="main" ng-controller="budstimeMainCtrl">
	<header id="hd">
		<div class="vcard budslogo">
			<strong class="fn">
				<a href="index.html" class="url" rel="me" title="Budstime: go to home">
					<img src="img/budstime-logo.png" width="100" height="23" alt="Budstime" />
				</a>
			</strong>
		</div>
		<form action="#" id="searchform" method="get">
			<fieldset>
				<legend class="hide">Search everthing on Budstime</legend>
				<input type="text" class="search-query" placeholder="search for people, events and things">
				<input type="submit" value="Search" class="hide">				
			</fieldset>
		</form>
		<div class="nav-logged-user">
			<div class="pull-left notification-section" ng-controller="notificationsCtrl">
				<a href="#" class="top-nav-item" ng-click="togglePopover()">
					 <span class="inbox-icon small-circle pull-right"></span>
					 <span class="inbox-counter" ng-bind="overall_unread" ng-hide="overall_unread<1">
					 </span>  
				</a>
				<div id="notification-popover" class="popover bottom hide" data-bt-toggle-fade="showNotifications">
		            <div class="arrow"></div>
		            <nav class="notification-hdr">
		            	<ul class="group">
		            		<li ng-click="changeTag('global')" ng-class="{ current: showGlobal }">
	            				<span class="pull-right inbox-counter" data-bt-fade-out="general_unread<1">
								 	{{general_unread}}
								</span>
								<span class="global-icon n-icon">&nbsp;</span>
		            		</li>
		            		<li ng-click="changeTag('users')" class="middle" ng-class="{ current: showUserRequests }">
		            			<span class="pull-right inbox-counter" data-bt-fade-out="user_unread<1">
								 	{{user_unread}}
								</span>
								<span class="user-req-icon n-icon">&nbsp;</span>
		            		</li>
		            		<li ng-click="changeTag('events')" ng-class="{ current: showEventRequests }">
	            				<span class="pull-right inbox-counter" data-bt-fade-out="event_unread<1">
								 	{{event_unread}}
								</span>
								<span class="event-req-icon n-icon">&nbsp;</span>
		            		</li>
		            	</ul>
		            </nav>
		            <div class="notification-body">
			            <div class="notification-cat" ng-repeat="cat in notifications" ng-switch on="cat.name">
			              	<div ng-switch-when="general" class="global-notification scroll-box" ng-class="{ zindexDown: !showGlobal}" bt-scroll-shown="showNotifications && showGlobal" bt-scroll-it="cat">
			              		<ul>
			              			<li ng-repeat="not in cat.notifications" ng-class="{ last: $last, unread: not.unread }">
			              				<a href="javascript: void(0);" class="profile-link img-inner">
			              					<img ng-src="{{getUserInfo(not.user_id, 'image_src')}}" height="26" width="26" alt="{{getUserInfo(not.user_id, 'name')}} profile picture" class="img-circle">
										</a>
										<div class="entry">
											<div ng-switch on="not.type">
												<p ng-switch-when="event_request">
												<strong>{{getUserInfo(not.user_id, 'name')}}</strong> has accepted your request to join "<strong>{{not.event_title}}</strong>"
												</p>
												<p ng-switch-when="friend_request">
												<strong>{{getUserInfo(not.user_id, 'name')}}</strong> has accepted you as a friend.</strong>
												</p>
											</div>
											<time>{{pretty_date(not.when)}}</time>
										</div>
									</li>
			              		</ul>
			              	</div>
			              	<div ng-switch-when="user_request" class="user-notification scroll-box" ng-class="{ zindexDown: !showUserRequests}" bt-scroll-shown="showNotifications && showUserRequests" bt-scroll-it="cat">
			              		<ul>
			              			<li ng-repeat="not in cat.notifications" ng-class="{ last: $last, unread: not.unread }">
			              				<a href="javascript: void(0);" class="profile-link img-inner">
			              					<img ng-src="{{getUserInfo(not.user_id, 'image_src')}}" height="26" width="26" alt="{{getUserInfo(not.user_id, 'name')}} profile picture" class="img-circle">
										</a>
										<div class="entry">
											<p>
												<strong>{{getUserInfo(not.user_id, 'name')}}</strong> would like to add you. 
											</p>
											<button class="btn btn-small btn-success">accept</button>
											<button class="btn btn-small btn-decline">decline</button>
											<time>{{pretty_date(not.when)}}</time>
										</div>
									</li>
			              		</ul>
			              	</div>
			              	<div ng-switch-when="event_request" class="event-notification scroll-box" ng-class="{ zindexDown: !showEventRequests}" bt-scroll-shown="showNotifications && showEventRequests" bt-scroll-it="cat">
			              		<ul>
			              			<li ng-repeat="not in cat.notifications" ng-class="{ last: $last, unread: not.unread }">
			              				<a href="javascript: void(0);" class="profile-link img-inner">
			              					<img ng-src="{{getUserInfo(not.user_id, 'image_src')}}" height="26" width="26" alt="{{getUserInfo(not.user_id, 'name')}} profile picture" class="img-circle">
										</a>
										<div class="entry">
											<p>
												<strong>{{getUserInfo(not.user_id, 'name')}}</strong> would like to join "<strong>{{not.event_title}}</strong>"
											</p>
											<button class="btn btn-small btn-success">accept</button>
											<button class="btn btn-small btn-decline">decline</button>
											<time>{{pretty_date(not.when)}}</time>
										</div>
										
									</li>
			              		</ul>
			              	</div>
			            </div>
		            </div>
		            <div class="notification-ft">
		            	<a href="#" class="see-all-btn btn-gray">
		            		see all notifications
		            	</a>
		            </div>
		        </div>				
			</div>
			<div class="btn-group logged-user">
			  <a class="dropdown-toggle top-nav-item" data-toggle="dropdown" href="#" id="dLabel">
			  	<span class="caret"></span>
			    <span class="img-inner">
			    	<img src="img/profile/ronaldo-26x26.jpg" height="26" width="26" alt="Ronaldo profile picture" class="img-circle">
			    </span>
			  </a>
			  <ul class="dropdown-menu pull-right" aria-labelledby="dLabel"> 
			  	<li class="naked-label"><strong>Ronaldo Luiz</strong></li>
			  	<li><a href="#">Account settings</a></li>
			  	<li class="divider"></li>
			    <li><a href="<?php echo $this->webroot; ?>/users/logout">Log out</a></li>
			  </ul>
			</div>
		</div>
	</header>
	<div id="content" class="group" ng-cloak>
		<div class="col-narrow pull-left col-margin" ng-controller="userInfosCtrl">
			<div class="text-space">
				<time class="today-text"><span class="arrow-icon">&raquo;</span> <strong class="highlight-text">Thursday</strong>, October 11, 2012</time>
			</div>
			<section class="user">
				<div class="btm-small-separator big-profile-picture">
					<a href="#" title="Go to profile page">
						<img src="img/profile/ronaldo-195x195.jpg" height="195" width="195" alt="Ronaldo profile picture" class="rd">
					</a>
					<div class="btn-group">
						<a href="#" class="btn dropdown-toggle" data-toggle="dropdown">
							<span class="setup-icon"></span>
						</a>
						<ul class="dropdown-menu pull-right"> 
							<li><a href="#" ng-click="removeProfilePic()">Remove picture</a></li>
							<li><a href="#">Add new picture</a></li>
						</ul>
					</div>	
				</div>	
				<div class="user-info">
					<h1 class="medium-header">Ronaldo Luiz</h1>
					<ul class="list">
						<li><span class="calendar-icon user-icon"></span> Born on <em class="dark-gray">September 20, 1976</em></li>
						<li><span class="job-icon user-icon"></span> Works at <em class="dark-gray">9nine</em></li>
						<li><span class="study-icon user-icon"></span> Studied at <em class="dark-gray">UNIRIO</em></li>
					</ul>
				</div>
				<div class="bordered-box rd hide" ng-init="showFollowers=false">
					<ul class="group follow-box">
						<li class="pull-left">
							<a href="#follow-modal" class="follow-item first show-follow-list" role="button" data-toggle="modal" ng-click="showFollowers=false">
								<span class="upper">Followers</span> <strong class="big">{{followers.length}}</strong>
							</a>
						</li>
						<li class="pull-right">
							<a href="#follow-modal" class="follow-item show-follow-list" role="button" data-toggle="modal" ng-click="showFollowers=true">
								<span class="upper">Following</span> <strong class="big">{{following.length}}</strong>
							</a>
						</li>
					</ul>
				</div>
				<div id="follow-modal" class="modal small-width hide fade" tabindex="-1" role="dialog" aria-hidden="true">
					  <div class="modal-header follow-modal-hdr">
					    	<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
					    	<ul class="follow-tabs group">
					    	<!-- 	<li class="first" ng-class="{ current: !showFollowers}">
					    			<a href="javascript: void(0);" ng-click="showFollowers=false">
					    				{{followers.length}} followers
					    			</a>
					    		</li> -->
					    		<li ng-class="{ current: showFollowers }">
					    			<a href="javascript: void(0);" ng-click="showFollowers=true">
					    				{{following.length}} friends
					    			</a>
					    		</li>
					    	</ul>
					  </div>
					  <div class="modal-body modal-body-follow">
					  	<div class="follow-search">
					  		<input type="text" class="filter-user-input" placeholder="Filter following by name..." ng-model="filterFollowing" ng-hide="!showFollowers">
					  		<input type="text" class="filter-user-input" placeholder="Filter followers by name..." ng-model="filterFollowers" ng-hide="showFollowers">
					  	</div>
					  	<div class="follow-lists-wrapper">
						  	<div id="following-list" class="follow-list scroll-wrapper group" ng-class="{ zindexDown: !showFollowers}" bt-scroll-it="following" bt-max-itens="5" bt-modal="#follow-modal">
						  		<ul>
						  			<li ng-repeat="u in following|filter:filterFollowing" ng-class="{ last: $last }" ng-init="u.name=getUserInfo(u.id, 'name')">
						  				<a href="#" class="group">
							  				<span class="img-inner event-owner" title="{{getUserInfo(u.id, 'name')}}">
												<img ng-src="{{getUserInfo(u.id, 'image_src')}}" height="37" width="37" alt="{{getUserInfo(u.id, 'name')}} picture" class="img-circle">
											</span>
											<span class="user-name">{{getUserInfo(u.id, 'name')}}</span>
										</a>
						  			</li>
						  		</ul>
						  	</div>
						  	<div id="followers-list" class="follow-list group" ng-class="{ zindexDown: showFollowers}" bt-scroll-it="following" bt-max-itens="5" bt-modal="#follow-modal">
						  		<ul class="group">
						  			<li ng-repeat="u in followers|filter:filterFollowers" ng-class="{ last: $last }" ng-init="u.name=getUserInfo(u.id, 'name')">
						  				<a href="#" class="group">
							  				<span class="img-inner event-owner" title="{{getUserInfo(u.id, 'name')}}">
												<img ng-src="{{getUserInfo(u.id, 'image_src')}}" height="37" width="37" alt="{{getUserInfo(u.id, 'name')}} picture" class="img-circle">
											</span>
											<span class="user-name">{{getUserInfo(u.id, 'name')}}</span>
										</a>
						  			</li>					  			
						  		</ul>
						  	</div>	
					  	</div>
					  	<div class="modal-footer-follow"></div>			   	
					  </div>					  
					</div>
			</section>
			<section class="section-following btm-separator">
				<h2 class="gray-header upper-small rd">Friends</h2>
				<ul class="following-list hrz-list group">
					
					<li ng-repeat="(key, u) in following | limitTo:3">
						<a href="javascript: void(0);" class="img-inner" data-tooltip-it="following" title="{{getUserInfo(u.id, 'name')}}">
							<img ng-src="{{getUserInfo(u.id, 'image_src')}}" height="44" width="44" alt="{{getUserInfo(u.id, 'name')}}" class="rd">
						</a>
					</li>
					
					<li class="last" ng-show="following.length > 3">
						<a href="#follow-modal" ng-click="showFollowers=true" class="btn-large btn-gray attending-item" role="button" data-toggle="modal" >+{{following.length-3}}</a>
					</li>
				</ul>   
			</section>
			<section class="section-groups" ng-controller="UserGroupsCtrl">
				<h2 class="gray-header upper-small rd">Groups</h2>
			
				<ul class="groups-list list">
				
					<li ng-repeat="group in groups" ng-mouseenter="closeToggle='show'" ng-mouseleave="closeToggle=''">
						<button type="button" class="close v_hdn" data-tooltip-it="group" title="Remove this group" ng-class="closeToggle" ng-click="removeGroup(group)" bs-tooltip="Remove this group">×</button>
						<a href="#add-group-modal" role="button" data-toggle="modal" ng-click="updateModal(group)">
							<span class="badge rd btn-gray">{{group.users.length}}</span> {{group.name}}
						</a>
					</li>	
									
				</ul>
				
				<div id="add-new-group" ng-init="addGroupField=true">					
					<a href="#add-group-modal" class="add-group-icon" 
					ng-click="addGroupField=false" ng-show="addGroupField">
						<span>Add group</span>
					</a>					
					<form submit-on="doAddGroup" ng-submit="addGroup()" class="group-field clr" ng-class="{ hdn_field: addGroupField }">
						<input type="text" ng-model="group.name" placeholder="type the group name..." data-on-enter="addGroup()" data-on-escape="clearAddGroup()" data-on-escape="clearAddGroup()" bt-autofocus="addGroupField">
						<button type="button" class="close" ng-click="clearAddGroup()">×</button>
					</form>
				</div>
				
				<div id="add-group-modal" class="modal small-width hide fade" tabindex="-1" role="dialog" aria-hidden="true">
					<div class="modal-header invite-friends-modal-hdr">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
						<h3>Groups</h3>
					</div>
				  <div class="modal-body modal-body-follow">
				  	<div class="group-modal-nav group" ng-init="listFriendsChecked=true">
				  		<div class="wrap-list-all-group pull-right">
				  			<span ng-class="{checked: listFriendsChecked, btn: true}" ng-click="listAllFriends()">
				  				<input type="checkbox" ng-model="listFriendsChecked">
				  				list all friends
				  			</span>
				  		</div>
				  		<div class="wrap-select-group">
					  		<select name="group-nav" id="group-nav" ng-options="group.id as group.name for group in groups" ng-model="group_select">
					  		</select>
				  		</div>
				  	</div>
				  	<div id="friends-in-group-list" class="friends-in-group-list" bt-scroll-it="users" bt-max-itens="5" bt-modal="#add-group-modal">
				  		<ul class="group">
				  			<li ng-repeat="user in users" class="group bt-user-toggle" ng-class="{show: attending, hide: !listFriendsChecked, last: $last }" bt-groups="groups" bt-slctd-group="group_select">
				  				<span class="img-inner event-owner" title="{{user.name}}">
									<img ng-src="{{user.image_src}}" height="26" width="26" alt="{{user.name}} profile picture" class="img-circle">
								</span>
								<span class="user-name">{{user.name}}</span>
							
								<span class="attending-status" ng-model="attending" ng-class="{added: attending}">
									<a href="javascript:void(0);" ng-hide="attending" ng-click="updateUserInGroupStatus(user, 'bind')">Add in the group</a>
									<span ng-show="attending">
										<button type="button" class="close pull-right" title="Remove from this group" ng-click="updateUserInGroupStatus(user, 'unbind')">×</button>
									Already added
									</span>
								</span>
				  			</li>
				  		</ul>
				  	</div>
				  	<div class="modal-footer-follow"></div>
				  </div>
				</div>				
			</section>
		</div>
		<div class="col-wide pull-left">
			<form action="#" id="budssearch" method="get" class="budssearch large-btm-separator">
				<fieldset>
					<legend class="hide">Search your buds</legend>
					<p class="form-heading">Search your buds</p>
					<ol class="hrz-list">
						<li>
							<input type="text" name="date-from" id="date-from" class="input-small input-calendar datepicker" placeholder="from">
						</li>
						<li class="larger-r-space">
							<input type="text" name="date-from-time" id="date-from-time" class="input-mini input-hour timepicker" placeholder="12:00">	
						</li>
						<li>
							<input type="text" name="date-to" id="date-to" class="input-small input-calendar datepicker" placeholder="to">
						</li>
						<li class="larger-r-space">
							<input type="text" name="date-to-time" id="date-to-time" class="input-mini input-hour timepicker" placeholder="12:00">	
						</li>
						<li>
							<button type="submit" class="btn">
								<img src="css/i/icons/search-icon.png" height="16" width="16" alt="Search">
							</button>		
						</li>
					</ol>
				</fieldset>
			</form>
			<div class="profile-calendar-wrapper" ng-controller="ProfileCalendarCtrl">
				<div class="profile-calendar">
					<header class="profile-calendar-hdr">
						<nav id="main-calendar-nav" bt-calendar-nav-year="current_year" bt-calendar-nav-month="current_month"></nav>
					</header>
					<div class="profile-calendar-body group" ng-hide="!calendarDayView">
						<div ng-repeat="section in sections" ng-switch on="section.type">
							
							<div class="profile-calendar-period group"  ng-switch-when="friend_events">
								<time class="calendar-hour-col">
									{{section.time_range.from}}
									<span class="hour-div">-</span>
									{{section.time_range.to}}
								</time>
								<div class="calendar-main-col">
									<div class="text-space">
										<!-- needs to be dinamic -->
										<a href="javascript: void(0);" class="attending-item attending-dashed">
											<span class="truncate">Make some plan</span>
											<span class="img-inner event-owner" data-tooltip-it="section" title="Ronaldo Luiz">
												<img src="img/profile/ronaldo-26x26.jpg" height="26" width="26" alt="Ronaldo profile picture" class="img-circle">
											</span>
										</a>
										<!-- /needs to be dinamic -->
									</div>					
									<ul class="hrz-list group attending-list">
										<li ng-repeat="(key, fe) in section.friend_events | limitTo:2">
											<a href="javascript: void(0);" class="btn-gray attending-item" title="{{fe.title}}" ng-click="showEventDetails(fe.id)">
												<span class="truncate">{{fe.title}}</span>
												<span class="img-inner event-owner" data-tooltip-it="fe" title="{{getUserInfo(fe.user_id,'name')}}">
													<img ng-src="{{getUserInfo(fe.user_id,'image_src')}}" height="26" width="26" alt="{{getUserInfo(fe.user_id,'name')}} profile picture" class="img-circle">
												</span>
											</a>
										</li>
										<li class="last">
											<a href="#" class="plus-btn btn-gray attending-item" ng-show="section.friend_events.length > 2">
												{{section.friend_events.length-2}}+
											</a>
										</li>
									</ul>
								</div>
							</div><!-- profile-calendar-period -->
							
							<div class="profile-calendar-period period-owner group" ng-switch-when="event"> 
								<time class="calendar-hour-col notification-flag">
									{{section.time_range.from}}
									<span class="hour-div">-</span>
									{{section.time_range.to}}
								</time>
								
								{{returnEvent(section)}}
								
								<div class="calendar-main-col">
									<h2 class="medium-header">{{event.title}}</h2>
									<div class="calendar-period-setup">
										<div class="btn-group event-setup-btn-group">
										  <a class="dropdown-toggle" data-toggle="dropdown" href="#">
										  	<span class="small-circle white-circle-btn">
										  		<span class="skip arrow-open-subnav">Period setup</span>
										  	</span>
										  </a>
										  <ul class="dropdown-menu pull-right">
										  	<li><a href="#">Edit event</a></li>
										    <li><a href="#" ng-click="removeEvent(section)" >Remove event </a></li>
										  </ul>
										</div>
										<a href="#" class="twitter-icon social-icon" data-tooltip-it title="Published on Twitter">
											Share on Twitter
										</a>
										<a href="#" class="facebook-icon social-icon" data-tooltip-it title="Published on facebook">
											Share on facebook
										</a>														
									</div>
									<ul class="event-details-list">
										<li>
											<span class="location-icon"></span>
											<span class="light-gray">{{event.location}}</span>
										</li>
										<li>
											<div class="buds-attending">
												<span class="buds-icon"></span>
												
												<a href="#invite-friends-modal" class="small-circle white-circle-btn" title="Invite friends" role="button" data-toggle="modal" data-rel="followers" data-tooltip-it data-invite-modal="{{event.title}}">
													<span class="skip invite-buds-icon">Invite friends</span>
												</a>
												
												<a ng-repeat="u in event.users" data-tooltip-it="event.users" href="javascript: void(0);" class="profile-link img-inner" ng-init="u.name=getUserInfo(u.id, 'name')" title="{{u.name}}">
													<img ng-src="{{getUserInfo(u.id, 'image_src')}}" height="26" width="26" alt="{{u.name}} profile picture" class="img-circle">
												</a>
											</div>
										</li>
										
										<li class="btm-separator">
											<span class="note-icon"></span>
											{{event.detail}}
										</li>
										
										<li class="last">
											<div class="btn-group upload-btns">
											  <button class="btn btn-small"><span class="upload-icon"></span> photo</button>
											  <button class="btn btn-small">video</button>
											</div>
										</li>
									</ul>
									
									<div class="gallery-box">
										<a href="#" class="link-view-album"><span class="expand-icon"></span>view album</a>
										<div class="carrossel-scope crousel-it">
											<ul class="group list-carrossel">
							 					<li ng-repeat="image in event.gallery">
							 						<a href="javascript: void(0);" ng-click="openGalleryItem(image)">
							 							<img ng-src="{{image.src}}" width="55" height="55" alt="{{image.title}}">
							 						</a>
							 					</li>
											</ul>
										</div>							
									</div>
									
									<div class="comment-box">
										<div class="comment-header">
											
											<a href="javascript: void(0);" title="See all comments" class="gray-link" ng-click="showAllComments(event.id)" ng-show="event.comments.comments_left > 0">
		 										<span class="comment-icon"></span>
		 										see all {{event.comments.comments_length}} comments
											</a>
											
											<span class="gray-link" ng-show="event.comments.comments_left < 1">
												{{event.comments.comments_length}}  comments
											</span>
										</div>
										
										<div class="comment-list media">
											
											<div class="comment-item" ng-repeat="comment in event.comments.last_comments">
												<a href="profile/{{comment.user_id}}" class="profile-link pull-left img-inner">
													<img ng-src="{{getUserInfo(comment.user_id, 'image_src')}}" height="26" width="26" alt="{{getUserInfo(comment.user_id, 'name')}} profile picture" class="img-circle">
												</a>
												<div class="comment-body">
													<a href="profile/{{comment.user_id}}" class="comment-author gray-link">{{getUserInfo(comment.user_id, 'name')}}</a>
													<p class="light-gray">{{comment.entry}}</p>
												</div>
											</div>
											
											<div class="comment-item">
												<a href="#" class="profile-link pull-left img-inner">
													<img src="img/profile/ronaldo-26x26.jpg" height="26" width="26" alt="Ronaldo profile picture" class="img-circle">
												</a>
												
												<div class="comment-body media-body">
													<form submit-on="doAddComment" ng-submit="addComment(section)" >			
														<textarea ng-model="section.newComment" class="comment-field auto-resize" placeholder="your comment..." on-enter="addComment(section)"></textarea>
														<input type="submit" value="Send" class="hide" ng-show="selected" />
													</form>
													<div class="check hide">
														<input type="checkbox" id="sendwithenter" class="pull-left" ng-model="selected"><label for="sendwithenter">Send comment by typing Enter</label>
													</div>
												</div>
											</div>
											
										</div>
										
									</div><!-- comment-box -->
									
								</div>
							</div><!-- profile-calendar-period -->
						</div>					
					</div><!-- profile-calendar-body -->
				</div><!-- profile-calendar -->
				<div class="profile-calendar-bg"></div>
			</div><!-- profile-calendar-wrapper -->
		</div>
		<div class="col-narrow pull-right">
			<div class="large-btm-separator top-empty-column">
				<a href="#add-event-modal" class="btn btn-warning upper-small" title="Add new event" role="button" data-toggle="modal">
					<span class="plus-icon"></span> Add Action
				</a>
				<div id="add-event-modal" class="modal small-width add-event-modal hide fade" tabindex="-1" role="dialog" aria-labelledby="add_event" aria-hidden="true" ng-controller="eventFormCtrl">
				  <div class="modal-header">
				    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
				    <h3 id="add_event">New event</h3>
				  </div>
				  <div class="modal-body">
				   	<form action="javascript:;" class="add-event-form">
				   		<fieldset>
				   			<legend class="hide">Add event form</legend>
				   			<ol>
				   				<li>
				   					<label for="add-event-name">Name</label>
				   					<input type="text" id="add-event-name" class="input-xxlarge" placeholder="Ex.: My birthday">
				   				</li>
				   				<li bt-slide-toggle="!showAditionalOpts">
				   					<label for="add-event-detail">Details</label>
				   					<textarea id="add-event-detail" class="input-xxlarge" placeholder=""></textarea>
				   				</li>
				   				<li class="pull-left">
				   					<label for="add-event-date">When?</label>
				   					<input type="text" name="event-date" id="add-event-date" class="input-small input-calendar datepicker" data-set-current-date="true">
				   					<input type="text" name="event-time" id="event-time" data-set-current-time="from" class="input-mini input-hour timepicker" placeholder="00:00">
				   				</li>
				   				<li class="col-2 pull-left wrap-to-time">
				   					<label class="to-label pull-left" for="add-event-date-2">to:</label>
				   					<input type="text" name="event-date" id="add-event-date-2" class="input-small input-calendar datepicker" data-set-current-date="true">
				   					<input type="text" name="event-time-to" id="event-time-to" data-set-current-time="to" class="input-mini input-hour timepicker last" placeholder="00:00">
				   				</li>
				   				<li class="col-1 clr" bt-slide-toggle="!showAditionalOpts">
				   					<label for="add-event-place">Where?</label>
				   					<input type="text" id="add-event-place" class="input-xxlarge" placeholder="Add a location">
				   				</li>
				   			</ol>
				   			<ol class="group clr last">
				   				<li class="pull-left wrap-privacy">
				   					<div class="btn-group">
									  <button class="btn" ng-class="{ active : privacy=='public' }" ng-click="privacyToggle('public')">public</button>
									  <button class="btn" ng-class="{ active : privacy=='private' }" ng-click="privacyToggle('private')">private</button>
									</div>
				   				</li>
				   				<li class="pull-left">
				   					<span class="btn">
							  				invite friends
						  			</span>
				   				</li>
				   				<li class="pull-right">
				   					<span class="btn btn-aditional-opts" ng-class="{active: showAditionalOpts}" ng-click="toggleAditional()">
				   						<span class="arrow-toogle"></span>
						  				aditional options
						  			</span>
				   				</li>
				   			</ol>
				   			<fieldset id="add-event-aditional" class="clr" style="display: none" bt-slide-toggle="showAditionalOpts">
				   				<div class="deep-box">
				   					<ul>
				   						<li class="pull-left">
						   				<select class="event-privacy-slct">
						   					<option value="0" selected="selected">Visible to everyone</option>
						   				</select>
						   				</li>
						   				<li class="pull-right">
								   		<span class="btn">
							  				<input type="checkbox" ng-model="shreOnFacebookChecked">
							  				share on facebook
							  			</span>
							  			</li>
							  			<li class="clr">
							  				<label for="add-event-youtube">Youtube video</label>
				   							<input type="text" id="add-event-youtube" class="input-xxlarge" placeholder="Ex.: http://www.youtube.com/watch?v=aBcDXyZ">
										</li>
										<li class="clr">
								  			<div class="btn-group upload-btns">
											  <button class="btn btn-small">
											  	<span class="upload-icon"></span> photo
											  </button>
											</div>
										</li>
									</ul>									
					   				<span class="arrow-top"></span>
				   				</div>
				   			</fieldset>
				   		</fieldset>
				   	</form>
				  </div>
				  <div class="modal-footer">
				    <button class="btn pull-left" data-dismiss="modal" aria-hidden="true">Cancel</button>
				    <button class="btn btn-warning">Add event</button>
				  </div>
				</div>
			</div>
			<section class="upcoming-events" ng-controller="upcomingEventsCtrl">
				<h2 class="upper-small btm-small-separator">Your Upcoming events</h2>
				<ol class="upcoming-list rd bordered-box">
					<li ng-repeat="event in upcoming_events" class="event-item" ng-click="openEventDetail(event.id);" ng-class="{ last: $last, first: $first }">
						<header>
							<time class="date-box group">
								<abbr title="{{event.date.month}}" class="month">{{event.date.month}}</abbr>
								<strong class="day">{{event.date.day}}</strong>
							</time>
							<time class="event-hour upper-small">{{event.date.time_range.from}} - {{event.date.time_range.to}}</time>
							<h3 class="small-header">
								<a href="javascript: void(0);" ng-click="openEventDetail(event.id);" class="gray-link">{{event.title}}</a>
							</h3>
						</header>
						<div class="buds-attending" ng-hide="!event.users">
							<span class="buds-icon"></span>
							
							<a href="javascript: void(0);" ng-repeat="(key, u) in event.users | limitTo:4" class="profile-link img-inner" title="{{getUserInfo(u.id, 'name')}}" ng-click="openProfilePage(u.id)" data-tooltip-it="users">
								<img ng-src="{{getUserInfo(u.id, 'image_src')}}" height="26" width="26" alt="{{getUserInfo(u.id, 'name')}} profile picture" class="img-circle">
							</a>
							
							<a href="javascript: void(0);" class="small-circle btn-gray plus-circle pull-right" ng-show="event.users.length > 4">{{event.users.length-4}}+</a>
							
						</div>
					</li>
				</ol>
			</section>
		</div>
	</div>
	<footer id="ft" class="hide"></footer>
	<div id="invite-friends-modal" class="modal small-width hide fade" tabindex="-1" role="dialog" aria-hidden="true" ng-controller="inviteFriendsCtrl">
		<div class="modal-header invite-friends-modal-hdr">
			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
			<h3>Invite friends  <span class="arrow">»</span>  "<span class="event-name"></span>"</h3>
		</div>
	  <div class="modal-body modal-body-follow">
	  	<div class="follow-search invite-friends-search">
	  		<span class="selected-itens" ng-hide="count<1">
	  			<strong class="selected-count">{{count}}</strong> selected
	  		</span>
	  		<input type="text" class="filter-user-input" ng-model="filterInviteList" placeholder="Filter by name...">
	  	</div>
	  	<div class="follow-list invite-friends-list group" bt-scroll-it="invite" bt-max-itens="5" bt-modal="#invite-friends-modal">
	  		<ul>
	  			<li ng-repeat="u in invite|filter:filterInviteList" ng-class="{ last: $last }" ng-init="u.name=getUserInfo(u.id, 'name')">
	  				<a href="#" class="group">
	  					<input type="checkbox" class="check" ng-model="u.cheked" ng-click="toggleCounting(u.cheked)">
		  				<span class="img-inner event-owner">
							<img ng-src="{{getUserInfo(u.id, 'image_src')}}" height="37" width="37" alt="{{u.name}} profile picture" class="img-circle">
						</span>
						<span class="user-name">{{u.name}}</span>
					</a>
	  			</li>
	  		</ul>
	  	</div>
	  </div>
	  <div class="modal-footer">
	    <button class="btn pull-left" data-dismiss="modal" aria-hidden="true">
	    	Cancel
	    </button>
	    <button class="btn btn-warning btn-confirm" ng-click="sendInvitation()">
	    	Send Invitation
	    </button>
	  </div>
	</div>
</div>

<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="js/libs/jquery-1.8.2.min.js"><\/script>')</script>
<script src="js/libs/angular.min.js"></script>
<script src="js/bs/bootstrap-dropdown.js"></script>
<script src="js/bs/bootstrap-tooltip.js"></script>
<script src="js/bs/bootstrap-datepicker.js"></script>
<script src="js/bs/bootstrap-timepicker.js"></script>
<script src="js/bs/bootstrap-modal.js"></script>
<script src="js/bs/bootstrap-alert.js"></script>
<script src="js/jq/jquery.maskedinput-1.3.min.js"></script>
<script src="js/jq/jquery.jcarousel.min.js"></script>
<script src="js/app/budstime.modals.js"></script>
<!-- scroll -->
<script src="js/jq/scroll/jquery.jscrollpane.min.js"></script>
<script src="js/jq/scroll/jquery.mousewheel.js"></script>
<script src="js/jq/scroll/mwheelIntent.js"></script>
<!-- /scroll -->
<script src="js/jq/jquery.textarea.autoresize.js"></script>
<!-- angular controllers -->
<script src="js/app/events.controller.js"></script>
<script src="js/app/groups.controller.js"></script>
<script src="js/app/upcoming.controller.js"></script>
<script src="js/app/userinfos.controller.js"></script>
<script src="js/app/invite.controller.js"></script>
<script src="js/app/notifications.controller.js"></script>
<script src="js/app/eventform.controller.js"></script>
<script src="js/app/main.controller.js"></script>
<!-- /angular controllers -->
<!-- angular directives -->
<script src="js/app/budstime.directives.js"></script>
<script src="js/app/budstime.utils.js"></script>
<script src="js/app/calendar.nav.js"></script>
<!-- /angular directives -->
</body>
</html>

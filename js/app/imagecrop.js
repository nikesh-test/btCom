var jCropper;        
var crop = {
	init: function(){
		crop.loadImage();
		if(!($('#imgProfilePreview').attr('src') === "/user_assets//profile.png")){
			$('#btnUpdate').removeAttr('disabled');
			/*$("#btnUpdate").unbind('click');
			$("#btnUpdate").bind('click', function(){
				crop.cropImage();
			});*/
		}
	},
	
	loadImage: function(){
		$("<img/>")
		.load(function() {
			jCropper = $.Jcrop('#imgProfilePreview', {
				minSize: [195, 195],
				maxSize: [195, 195],
				setSelect: [10, 10, 195, 195],
				bgColor: 'black',
				onSelect: crop.updateCoordinate
			});
			
			if(this.width < 195 || this.height < 195){
				$('#btnUpdate').attr('disabled', 'disabled');
				$("#btnUpdate").unbind('click');
			}
			
		}).error(function() { console.log("error loading image"); })
		.attr("src", $("#imgProfilePreview").attr("src"));
	},
	// update co-ordinate
	updateCoordinate: function(c){
		$('#x').val(c.x);
        $('#y').val(c.y);
        $('#w').val(c.w);
        $('#h').val(c.h);
	},
	
	triggerUploadComplete: function(data){
		//console.log(data);
		if(data){
			data = $.parseJSON(data);
			$("#imgProfilePreview").attr("src", "/user_assets/" + data.dir + "/" + data.name + "?timestamp=" + new Date().getTime());
			$('#imgname').val(data.name);
			$('#btnUpdate').removeAttr('disabled');
			$('#liRemovePic').show();
			crop.loadImage();
			
			/*$("#btnUpdate").unbind('click');
			$("#btnUpdate").bind('click', function(){
				crop.cropImage();
			});*/
		}
	},
	
	showMessage: function(message){
		alert(message);
		crop.loadImage();
	},
	
	clearObj: function(){
		$('#imgProfilePreview').removeAttr('style');
		jCropper.destroy();
		$('#btnUpdate').attr('disabled', 'disabled');
	},
	
	cropImage: function(){
		$('#cropFormImage').submit();
	},
	
	triggerCroppingCompleted: function(data){
		if(data){
			data = $.parseJSON(data);
			
			$('.profilePhoto').attr("src", "/user_assets/" + data.dir + "/" + data.name + "?timestamp=" + new Date().getTime())
		}
	}
};

crop.init();
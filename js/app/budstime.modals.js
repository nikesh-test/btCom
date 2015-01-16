var dialog_messages =  {
  "1575": {
    "type": "Warning",
    "message": "Are you sure you want to remove your profile picture?",
    "actions": [
      {
        "actionName": "Yes, remove!",
        "action": "yesAction('removeEvent', 'ProfileCalendarCtrl', remove_id)"
      },
      {
        "actionName": "Cancel",
        "action": "noAction()"
      },
      
    ]
  },
  "1576": {
    "type": "Warning",
    "message": "Are you sure you want to remove this event?",
    "actions": [
      {
        "actionName": "Yes, remove!",
        "action": "ng.removeEvent(params)"
      },
      {
        "actionName": "Cancel",
        "action": "hide"
      },
      
    ]
  },
  "1660": {
    "type" : "Warning",
    "message" : "Are you sure you want to remove this group?",
    "actions" : [
      {
        "actionName": "Yes, remove!",
        "action": "goToImageUpload()"
      },
      {
        "actionName": "Cancel",
        "action": "noAction()"
      }      
    ]
  },
  "1650": {
    "type" : "Success",
    "message" : "Are you sure you want to remove?",
    "actions" : [
      {
        "actionName": "Yes",
        "action": "goToImageUpload()"
      },
      {
        "actionName": "No",
        "action": "noAction()"
      }      
    ]
  },
  "1220": {
    "type" : "Info",
    "message" : "Are you sure you want to remove?",
    "actions" : [
      {
        "actionName": "Yes",
        "action": "goToImageUpload()"
      },
      {
        "actionName": "No",
        "action": "noAction()"
      }      
    ]
  }
};
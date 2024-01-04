
function CreateRiskDialog() {
    $('<div id = dialog align =center > ' +
        '<form id = note-form class= form-group>' +
        ' <input type= name name= TeamName class= form-control id= teamName placeholder= "Team Name" required>' +
        '<br><br>' +
        '<textarea id= newNote class= form-control-textfield rows = 5 col = 10 maxlength= 600 placeholder= "Type your risk here" resize:none required></textarea>' +
        '<br><br><br><br><br>' +
        ' </form>' + ' </div>'
    ).dialog({
        title: 'Identify New Risk',
        autoOpen: true,
        modal: true,
        width: $(window).width() > 400 ? 400 : 'auto',
        resizable: false,
        draggable: false,
        buttons: {
            'Ok': {
                text: 'Add Risk',
                'class': 'dialogButton',
                'id': 'confim',
                click: function () {
                    if (document.getElementById("teamName").value == "" && document.getElementById("newNote").value == "") {
                        alert('Please enter a team name and note before adding.');
                        return;
                    } else if (document.getElementById("teamName").value == "") {
                        alert('Please enter a team name before adding.');
                        return;
                    } else if (document.getElementById("newNote").value == "") {
                        alert('Please enter a note before adding.');
                        return;
                    } else {
                        addRisk();
                        $(this).dialog('destroy');
                    }

                }
            },
            'Close': {
                text: 'Cancel',
                'class': 'dialogButton',
                'id': 'confim',
                click: function () {
                    $(this).dialog('destroy');
                }
            }
        }
    });
}

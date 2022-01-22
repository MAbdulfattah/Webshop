// Sort the table
function sortTable(n, tableID) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById(tableID);
    switching = true;
    dir = "asc";

    while (switching) {

        switching = false;
        rows = table.rows;

        for (i = 1; i < (rows.length - 1); i++) {

            shouldSwitch = false;

            x = rows[i].getElementsByTagName("td")[n];
            y = rows[i + 1].getElementsByTagName("td")[n];

            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {

                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {

                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {

            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;

            switchcount++;
        } else {

            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

// Reset Button while staying on same page
async function reset() {
     await $.ajax({url: "https://wt.ops.labs.vu.nl/api22/10b20797/reset"});
	window.location.reload()
}

// Post element to server while staying on same page
$(document).ready(function(){
   var $form = $('form');
   $form.submit(function(){
      $.post($(this).attr('action'), $(this).serialize(), function(){
            window.location.reload()
      },'json');
      return false;
   });
});

// Retrieve element from server 
$(document).ready(function (){
    $('#topSelling').DataTable({
        ajax: {
            url: "https://wt.ops.labs.vu.nl/api22/10b20797",
            dataSrc: '',
        },
        columns: [
            {"data": "brand"},
            {"data": "model"},
            {"data": "os"},
            {"data": "screensize"},
            {
                "data": "image",
                render: function (data) {
                    return `<img src="${data}"/>`
                }
            }
        ]
    })
   
});

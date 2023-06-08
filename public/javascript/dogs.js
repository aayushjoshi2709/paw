
list_action = function(e, id) {
    if (e.value === 'Edit') {
      window.location.href = `/admin/dashboard/dogs/edit/${id}`;
    } else if (e.value === 'Delete') {
      fetch(`/admin/dashboard/dogs/${id}`, {
        method: 'DELETE'
      })
      .then((res) => {
        if(res.status === 200){
          window.location.reload();
        }
      })
      .catch((ex) => {
        console.log(ex);
      });
    }
}
function createGroup(){
  Swal.fire({
    title: 'Create Group',
    text: 'Group Name:',
    icon: 'info',
    input: "text",
    confirmButtonText: 'Create'
  }).then((result) => {
      Swal.fire('Successfully Created')
  })
}

const btn = document.getElementById('auth-btn');
        const islogin = localStorage.getItem('islogin') === 'true';
        const currentPage = location.pathname.split("/").pop();

        function updateButton(){
            if(islogin){
                  btn.innerHTML = '<i class="bi bi-box-arrow-right"></i> ログアウト';
                btn.addEventListener('click',() => {
                    localStorage.setItem('islogin','false');
                    location.reload();
                });
            }else{
              btn.innerHTML = '<i class="bi bi-person-circle"></i> ログイン';
                btn.addEventListener('click',() => {
                    localStorage.setItem("redirect_after_login", currentPage);
                    location.href = '/cat-life/login.html';
                });
            }
        }
        updateButton();    
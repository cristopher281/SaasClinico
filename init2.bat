git rm -rf --cached .
git add .
git commit -m "primer commit"
git branch -M main
git remote remove origin
git remote add origin https://github.com/cristopher281/SaasClinico.git
git push -u origin main

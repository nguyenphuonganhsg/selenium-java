package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class LoginPage extends BasePage{

    By userNameTxt      = By.id("username");
    By passwordTxt      = By.id("password");
    By loginBtn         = By.xpath("//button[contains(.,'Login')]");

    public LoginPage(WebDriver driver){
        super(driver);
        open("https://the-internet.herokuapp.com/login");
    }

    public void login(String username, String password){
        driver.findElement(userNameTxt).sendKeys(username);
        driver.findElement(passwordTxt).sendKeys(password);
        driver.findElement(loginBtn).click();
    }

}

package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.testng.Assert;

import java.util.HashMap;

public class CheckboxPage extends BasePage{
    HashMap<String, By> checkboxes;

    public CheckboxPage(WebDriver driver){
        super(driver);
    }

    public void open(){
        driver.get("https://the-internet.herokuapp.com/checkboxes");
    }

    public boolean validateCheckboxChecked(By path){
        driver.findElement(path).click();
        return driver.findElement(path).isSelected();
    }
}

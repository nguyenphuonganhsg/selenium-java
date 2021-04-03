package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;

import java.util.HashMap;

public class vanillajsPage extends BasePage{
    HashMap<String, By> checkboxes;

    public vanillajsPage(WebDriver driver) {
        super(driver);
    }

    public void open(){
        driver.get("https://todomvc.com/examples/vanillajs/");
    }

    By txtTodo       = By.xpath("//*[@class='header']/input[@placeholder='What needs to be done?']");
    By label1       = By.xpath("//ul[@class='todo-list']/li[1]/div/label");
    By label2       = By.xpath("//ul[@class='todo-list']/li[1]/div/label");
    By btnAll      = By.xpath("//*[@class='filters']/li/a[@href='#/']");
    By countLbl      = By.xpath("//*[@class='todo-count']/strong");
    By completeBtn   = By.xpath("//*[@class='filters']/li/a[@href='#/completed']");
    By editTxt       = By.xpath("//ul[@class='todo-list']/li[1]/div/");
    By deleteBtn     = By.xpath("//ul[@class='todo-list']/li[1]/div/button[@class='destroy']");

    Actions actions = new Actions(driver);

    public void validate(){
        Actions actions = new Actions(driver);
        driver.findElement(txtTodo).sendKeys("meo con di cho troi mua 2");
        actions.sendKeys(Keys.ENTER).perform();
        Assert.assertTrue(driver.findElement(label2).getText().contains("meo con di cho troi mua 2"));

        driver.findElement(btnAll).click();
        Assert.assertEquals(driver.findElement(countLbl).getText(),"2");

        driver.findElement(By.xpath("//*[@class='filters']/li/a[@href='#/active']")).click();
        Assert.assertEquals(driver.findElement(By.xpath("//*[@class='todo-count']")).getText(),"2");

        driver.findElement(completeBtn).click();
        Assert.assertEquals( driver.findElements(By.xpath("//ul[@class='todo-list']/li")).size(), 0);

        WebElement inputEdit = driver.findElement(editTxt);

        actions.doubleClick(inputEdit).perform();

        String editValue = driver.findElement(By.xpath("//li[@class='editing']/input[@class='edit']")).getText();
        System.out.println(editValue);
    }

    public void createToto(String value){
        driver.findElement(txtTodo).sendKeys(value);
        actions.sendKeys(Keys.ENTER).perform();
    }

    public boolean checkCreated(String value){
        return (driver.findElement(label1).getText() == value);
    }

    public String checkCountToto(){
        return driver.findElement(countLbl).getText();
    }

    public int countListToto(){
        return driver.findElements(By.xpath("//ul[@class='todo-list']/li")).size();
    }

    public void editToto(){
        Actions actions = new Actions(driver);
        WebElement inputEdit = driver.findElement(editTxt);

        actions.doubleClick(inputEdit).perform();

  //      String editValue = driver.findElement(By.xpath("//li[@class='editing']/input[@class='edit']")).getText();
   //     System.out.println(editValue);
    }

    public void deleteToto(String todoItem){
        WebElement deleteElement = driver.findElement(getToto(todoItem));
        actions.moveToElement(deleteElement).perform();
        driver.findElement(removeToto(todoItem)).click();
    }

    public By getToto(String todoItem){
        return By.xpath(String.format("label[.='%s']", todoItem));
    }

    public By removeToto(String todoItem){
        return By.xpath(String.format("//label[.='%s']/following-sibling::button", todoItem));

    }

    public void completeToto(String todoItem){
        By completeItem = By.xpath(String.format("//label[.='%s']/preceding-sibling::input", todoItem));
        WebElement completeElement = driver.findElement(completeItem);
        completeElement.click();
    }

    public int countCompleteToto(){
        driver.findElement(completeBtn).click();
        return driver.findElements(By.xpath("//ul[@class='todo-list']/li[@class='completed']")).size();
    }

    class AllTab{
        void seleted(){
            System.out.println("try inner Class");
        }
    }
}

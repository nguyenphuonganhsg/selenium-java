package modules;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.testng.Assert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;
import pages.vanillajsPage;

import static java.lang.Integer.parseInt;

public class vanillajsTest extends BaseTest{

    @Test
    void validateCreateTodo(){
        vanillajsPage jsPage = new vanillajsPage(driver);
        jsPage.open();

        String textInput = "meo con di cho troi mua";

        int itemLeftBefore = jsPage.countListToto();
        jsPage.createToto(textInput);

        int itemLeftAfter = jsPage.countListToto();
        Assert.assertEquals(itemLeftAfter - itemLeftBefore, 1);
    }

    @Test
    void validateDeleteTodo(){
        vanillajsPage jsPage = new vanillajsPage(driver);
        jsPage.open();
        String textInput = "meo con di cho troi mua";

        jsPage.createToto(textInput);

        int itemLeftBefore = jsPage.countListToto();
        jsPage.deleteToto(textInput);

        int itemLeftAfter = jsPage.countListToto();
        Assert.assertEquals(itemLeftAfter - itemLeftBefore, -1);
    }

    @Test
    void validateCompleteTodo(){
        vanillajsPage jsPage = new vanillajsPage(driver);
        jsPage.open();

        String textInput = "meo con di cho troi mua 3";

        jsPage.createToto(textInput);

        jsPage.completeToto(textInput);

        int countCompleted= jsPage.countCompleteToto();
        Assert.assertEquals(countCompleted, 1);
    }
}


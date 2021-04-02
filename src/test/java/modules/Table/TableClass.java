package modules.Table;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.util.Comparator;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

public class TableClass {
    private static WebDriver driver;

    @BeforeMethod
    static void setup(){
        //Step 1
        WebDriverManager.chromedriver().setup();
        driver =  new ChromeDriver();
        driver.get("https://the-internet.herokuapp.com/tables");
    }

    @Test
    static void FindMinMaxDuePerson() {
//        List<WebElement> tr = driver.findElements(By.xpath("//*[@id='table1']/tbody/tr[1]/td"));
//        String cellLocatior = "//table[@id='table1']/tbody/tr[%s]/td[%s]";
//        System.out.println(tr.size());
//        for (int row=0 ;  row <= tr.size() ; row++) {
//            List<WebElement> td = driver.findElements(By.xpath("//*[@id='table1']/tbody/tr[" + row + "]/td"));
//            for (int column = 0; column <= td.size(); column++) {
//               System.out.println(driver.findElement(By.xpath(String.format(cellLocatior, row, column))));
//
//                System.out.println(column);
//            }
//        }
       // Assert.assertTrue(driver.getCurrentUrl().contains("status_codes"));

        List<WebElement> cells = driver.findElements(By.xpath("//*[@id='table1']/tbody/tr/td[4]"));
        List<String> dues = cells.stream().map(WebElement::getText).collect(Collectors.toList());

        Float max = Float.valueOf(dues.get(0).replace("$",""));
        int maxindex = 0;
        for (int i=0 ;  i < dues.size() ; i++) {
            if(Float.valueOf(dues.get(i).replace("$","")) > max )
            {
                max = Float.valueOf(dues.get(i).replace("$",""));
                maxindex = i;
            }
        }
        String firstName = driver.findElement(By.xpath(String.format("//*[@id='table1']/tbody/tr[%s]/td[2]", maxindex + 1))).getText();
        String lastName = driver.findElement(By.xpath(String.format("//table[@id='table1']//tr[%s]/td[1]",maxindex+1))).getText();
        System.out.println(firstName + " " + lastName);
        Assert.assertEquals(String.format("%s %s", firstName, lastName), "Jason Doe");
    }

    @Test
    void maximumDuePerson(){
        List<WebElement> rows = driver.findElements(By.xpath("//*[@id='table1']/tbody/tr"));
        List<Person> person = rows.stream().map(TableClass::toPerson).collect(Collectors.toList());
        Person maxDuePerson = person
                .stream()
                .max(Comparator.comparing(Person::getDue))
                .orElseThrow(NoSuchElementException::new);
        System.out.println(maxDuePerson.getFullName());

        Assert.assertEquals(maxDuePerson.getFullName(), "Jason Doe");
    }

    static void minimumDuePerson(){
        List<WebElement> rows = driver.findElements(By.xpath("//*[@id='table1']/tbody/tr"));
        List<Person> person = rows.stream().map(TableClass::toPerson).collect(Collectors.toList());
        Person minDuePerson = person
                .stream()
                .min(Comparator.comparing(Person::getDue))
                .orElseThrow(NoSuchElementException::new);
        System.out.println(minDuePerson.getFullName());

        Assert.assertEquals(minDuePerson.getFullName(), "Jason Doe");
    }

    @Test
    void deleteRow(){
        List<WebElement> rows = driver.findElements(By.xpath("//*[@id='table1']/tbody/tr"));
        List<Person> persons = rows.stream().map(TableClass::toPerson).collect(Collectors.toList());
        Person filterPerson = persons.stream()
                .filter(person -> person.getFirstName().equals("Frank"))
                .findAny()
                .orElse(null);

        System.out.println(filterPerson.getFullName());
        Assert.assertEquals(filterPerson.getFullName(), "Frank Bach");
    }

    static Person toPerson(WebElement row ){
        List<WebElement> cells = row.findElements(By.tagName("td"));
        String firstName = cells.get(1).getText();
        String lastName = cells.get(0).getText();
        String email = cells.get(2).getText();
        String due = cells.get(3).getText().replace("$","");
        String website = cells.get(4).getText();

        return new Person(firstName, lastName, email, Float.valueOf(due), website);
    }

    @AfterMethod
    static  void tearDown(){
        driver.quit();
    }
}

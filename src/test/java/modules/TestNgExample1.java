package modules;

import org.testng.annotations.*;

public class TestNgExample1 {
    @BeforeSuite
    void beforeSuite(){
        System.out.println("start suite");
    }

    @BeforeTest
    void beforeTest(){
        System.out.println("start test");
    }

    @BeforeClass
    void beforeClass(){
        System.out.println("start class");
    }

    @BeforeMethod
    void beforeMethod(){
        System.out.println("start method");
    }

    @Test
    void testcase1(){
        System.out.println("test case 1");
    }

    @Test
    void testcase2(){
        System.out.println("test case 1");
    }

    @Test
    void testcase3(){
        System.out.println("test case 1");
    }

    @AfterMethod
    void afterMethod(){
        System.out.println("end method");
    }

    @AfterTest
    void afterTest(){
        System.out.println("end test");
    }

    @AfterClass
    void afterClass(){
        System.out.println("end class");
    }

    @AfterSuite
    void afterSuite(){
        System.out.println("end suite");
    }
}

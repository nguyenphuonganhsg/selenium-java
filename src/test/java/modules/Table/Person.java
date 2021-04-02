package modules.Table;

import org.testng.annotations.Test;

public class Person {
    String FirstName;
    String LastName;
    String Email;
    Float Due;
    String Website;

    public Person(String firstName, String lastName, String email, Float due, String website) {
        FirstName = firstName;
        LastName = lastName;
        Email = email;
        Due = due;
        Website = website;
    }

    public String getFirstName() {
        return FirstName;
    }

    public String getLastName() {
        return LastName;
    }

    public String getEmail() {
        return Email;
    }

    public Float getDue() {
        return Due;
    }

    public String getWebsite() {
        return Website;
    }

    public void setFirstName(String firstName) {
        FirstName = firstName;
    }

    public void setLastName(String lastName) {
        LastName = lastName;
    }

    public void setEmail(String email) {
        Email = email;
    }

    public void setDue(Float due) {
        Due = due;
    }

    public void setWebsite(String website) {
        Website = website;
    }

    public String getFullName(){
        return String.format("%s %s", getFirstName(), getLastName());
    }
}

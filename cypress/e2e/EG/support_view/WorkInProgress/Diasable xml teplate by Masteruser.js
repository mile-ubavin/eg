/// <reference types="Cypress" />

describe("Disable XML template by Master-user", () => {
  // Custom command to load t based on the selected language
  Cypress.Commands.add("loadTranslate", (language) => {
    cy.fixture(`${language}.json`).as("t");
  });
  //getOppositeLanguage
  function getOppositeLanguage(currentLanguage) {
    return currentLanguage === "English" ? "German" : "English";
  }

  it("Diasable xml teplate by Masteruser", () => {
    cy.loginToSupportViewMaster(); //login as a masteruser
    //get language
    cy.get(".lagnuage-menu")
      .invoke("text")
      .then((selectedLanguage) => {
        const oppositeLanguage = getOppositeLanguage(selectedLanguage.trim());
        cy.log(`Selected Languages: ${selectedLanguage}`);
        cy.log(`Switching to Opposite Language: ${oppositeLanguage}`);

        // Select the opposite language
        cy.selectLanguage(oppositeLanguage);

        // Load t based on the opposite language
        cy.loadTranslate(oppositeLanguage);
      });
    cy.get("@t").then((t) => {
      //Search for Group section
      cy.get("#searchButton>span")
        .invoke("text")
        .then((search) => {
          expect(search, "Search:").to.include(t["Search"]);
        });
      cy.get("#searchButton>span").click(); //Click on search button
      //Search form label

      cy.get(".search-dialog>form>.form-fields>.searchText-wrap>.label")
        .eq(0)
        .invoke("text")
        .then((searchLabel) => {
          expect(searchLabel, "Search label 1:").to.include(
            t["Account Number"]
          );
        }); //end
      cy.get(".search-dialog>form>.form-fields>.searchText-wrap>.label")
        .eq(1)
        .invoke("text")
        .then((searchLabel) => {
          expect(searchLabel, "Search label 2:").to.include(t["Display Name"]);
        }); //end
      cy.get(".search-dialog>form>.form-fields>.searchText-wrap>.label")
        .eq(2)
        .invoke("text")
        .then((searchLabel) => {
          expect(searchLabel, "Search label 3:").to.include(t["Description"]);
        }); //end

      //Search form Action buttons
      cy.get(".search-dialog>form>.form-actions>button>.mdc-button__label")
        .eq(0)
        .invoke("text")
        .then((searchButton) => {
          expect(searchButton, "Search button 1:").to.include(
            t["resetUserSearch"]
          );
        }); //end
      cy.get(".search-dialog>form>.form-actions>button>.mdc-button__label")
        .eq(1)
        .invoke("text")
        .then((searchButton) => {
          expect(searchButton, "Search button 2:").to.include(t["searchUser"]);
        }); //end

      //Search for Group by Display Name
      cy.get(".search-dialog>form>.form-fields>.searchText-wrap")
        .eq(1)
        .type("aqua");

      //Find the Search button by button name and click on it
      const search = t["searchUser"];
      cy.get(".search-dialog>form>.form-actions>button")
        .contains(search)
        .click();

      //Action buttons labels

      cy.get(".action-buttons>button>.mdc-button__label")
        .eq(0)
        .invoke("text")
        .then((actionButton) => {
          expect(actionButton, "Edit button").to.include(t["Edit"]);
        }); //end

      cy.get(".action-buttons>button>.mdc-button__label")
        .eq(1)
        .invoke("text")
        .then((actionButton) => {
          expect(actionButton, "Assign XML Template").to.include(
            t["Assign XML Template"]
          );
        }); //end

      cy.get(".action-buttons>button>.mdc-button__label")
        .eq(2)
        .invoke("text")
        .then((actionButton) => {
          expect(actionButton, "Assign PDF Dictionary").to.include(
            t["Assign PDF Dictionary"]
          );
        }); //end

      cy.get(".action-buttons>button>.mdc-button__label")
        .eq(3)
        .invoke("text")
        .then((actionButton) => {
          expect(actionButton, "Admin User").to.include(t["Admin User"]);
        }); //end

      cy.get(".action-buttons>button>.mdc-button__label")
        .eq(4)
        .invoke("text")
        .then((actionButton) => {
          expect(actionButton, "User").to.include(t["User"]);
        }); //end
      //Click on button with txt XmlTemplate... taken from translate
      const assignXmlTemplateButtonText = t["Assign XML Template"];

      cy.get(".action-buttons button")
        .contains(assignXmlTemplateButtonText)
        .click();

      // XML template TABLE

      cy.get(".pdf_dictionary__table>table>tbody>tr>td")
        .contains("BB Care")
        .parent() // Move up to the parent row
        .find('td:first-child input[type="checkbox"]')
        .uncheck(); //

      //  "BB Care" is in a specific <td> element
      cy.get(".pdf_dictionary__table>table>tbody>tr>td") //Get all td
        .contains("BB Care")
        .parent() // Move up to the parent row
        .find('td:first-child input[type="checkbox"]')
        .then(($checkbox) => {
          // Check if the checkbox is checked
          const isChecked = $checkbox.prop("checked");

          if (isChecked) {
            // If checkbox is checked, perform uncjeck actions
            cy.wrap($checkbox).invoke("click"); // click() to check the checkbox
            cy.log("Checkbox is already selected, deselect it");
            // Add your code to close the dialog or other actions
          } else {
            // If checkbox is not checked just log
            cy.log("Checkbox is not selected. Selecting the checkbox...");
          }
        });

      //Find the Send button by txt
      const buttonTxt = t["Save"];
      cy.get(".pdf_dictionary>.pdf_dictionary__actions>button")
        .contains(buttonTxt)
        .click();
    }); //end TRANSLATE
    // Logout;
    cy.get(".logout-icon ").click();
    cy.wait(2000);
    cy.get(".confirm-buttons > :nth-child(2)").click();
    cy.url();
    cy.should("include", "https://supportviewpayslip.edeja.com/fe/login"); // Validate url
  }); //end it
}); //end describe

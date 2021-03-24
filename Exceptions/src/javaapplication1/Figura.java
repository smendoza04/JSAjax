/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package javaapplication1;

/**
 *
 * @author User
 */
public class Figura {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        getParam(4, 4, 4, 4);
    }
    
    public static void getParam(double... nombres) {
        try {
            if (nombres.length > 3) {
                nombres[] += nombres[];
            }
                
        } catch (Exception e) {
            System.out.println("Invalid");
        }
  }
    
}
